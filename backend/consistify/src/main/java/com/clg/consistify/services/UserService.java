package com.clg.consistify.services;

import com.clg.consistify.DTO.LoginBody;
import com.clg.consistify.DTO.RegisterBody;
import com.clg.consistify.exception.UserAlreadyExistException;
import com.clg.consistify.exception.UserNotFoundException;
import com.clg.consistify.exception.UsernameAlreadyExistException;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.MyUserDetailService;
import com.clg.consistify.user.UserModel;
import com.clg.consistify.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    private AuthenticationManager authenticationManager;

    public UserService(PasswordEncoder passwordEncoder, JwtUtils jwtUtil, MyUserDetailService userDetailsService, AuthenticationManager authenticationManager) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailService = userDetailsService;
    }
    private JwtUtils jwtUtil;

    private MyUserDetailService userDetailService;

    public String register(RegisterBody body){
        if (userRepository.findByEmail(body.getEmail()).isPresent()) {
            throw new UserAlreadyExistException("Email already exists");
        }

        if (userRepository.findByUsername(body.getUsername()).isPresent()) {
            throw new UserAlreadyExistException("Username already exists");
        }
        UserModel user=new UserModel();
        user.setUsername(body.getUsername());
        user.setEmail(body.getEmail());
        user.setPassword(passwordEncoder.encode(body.getPassword()));
        user.setXp(body.getXp());
        user.setRole(body.getRole());

        UserModel savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailService.loadUserByUsername(savedUser.getUsername());
        String jwt = jwtUtil.generateToken(savedUser.getUsername());
        return jwt;
    }

    public String login(LoginBody body){
        UserModel user=userRepository.findByEmail(body.getEmail())
                .orElseThrow(()-> new UserNotFoundException("User not found"));
        String username = user.getUsername();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, body.getPassword()));
        } catch (Exception e) {
            throw new BadCredentialsException("Username or Password Incorrect");
        }

        UserDetails userDetails = userDetailService.loadUserByUsername(username);
        String jwt = jwtUtil.generateToken(userDetails.getUsername());
        return jwt;
    }
    @Transactional
    public ResponseEntity<String> friendRequest(String fromUsername, String toUsername) {
        if (fromUsername.equals(toUsername)) {
            return ResponseEntity.badRequest().body("Cannot send friend request to yourself");
        }

        UserModel fromUser = userRepository.findByUsername(fromUsername)
                .orElseThrow(() -> new RuntimeException("Sender user not found"));

        UserModel toUser = userRepository.findByUsername(toUsername)
                .orElseThrow(() -> new RuntimeException("Recipient user not found"));
        if(toUser.getFriends().contains((fromUser))){
            return ResponseEntity.badRequest().body("Already friends");

        }
        // Prevent duplicate requests
        if (toUser.getFriendRequests().contains(fromUsername)) {
            return ResponseEntity.badRequest().body("Friend request already sent");
        }

        // Optional: Check if already friends
        if (toUser.getFriends().contains(fromUsername)) {
            return ResponseEntity.badRequest().body("You are already friends");
        }
        if(fromUser.getFriendRequests().contains(toUsername)){
            return ResponseEntity.badRequest().body("You already has its friend req");

        }

        toUser.getFriendRequests().add(fromUsername);
        userRepository.save(toUser);

        return ResponseEntity.ok("Friend request sent successfully");
    }
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "friends", key = "#fromUsername"),
            @CacheEvict(value = "friends", key = "#toUsername")
    })
    public void acceptRequest(String fromUsername,String toUsername){
        UserModel fromUser=userRepository.findByUsername(fromUsername).orElseThrow();
        UserModel toUser=userRepository.findByUsername(toUsername).orElseThrow();
        toUser.getFriends().add(fromUser);
        fromUser.getFriends().add(toUser);
        toUser.getFriendRequests().remove(fromUsername);
        fromUser.getFriendRequests().remove(toUsername);

        userRepository.save(fromUser);
        userRepository.save(toUser);
    }
    @Cacheable(value = "friends",key = "#username")
    public List<String> getFriendUsernames(String username) {
        UserModel user = userRepository.findByUsername(username).orElseThrow();
        return user.getFriends()
                .stream()
                .map(UserModel::getUsername)
                .toList();
    }
    public List<UserModel> getByUsername(String username){
        List<UserModel> users= userRepository.searchByUsername(username);
        return users;

    }
    public boolean hasRequestFrom(String fromUsername, String toUsername) {
        UserModel toUser = userRepository.findByUsername(toUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toUser.getFriendRequests().contains(fromUsername);
    }
}

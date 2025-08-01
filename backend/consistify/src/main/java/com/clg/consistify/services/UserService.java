package com.clg.consistify.services;

import com.clg.consistify.DTO.LoginBody;
import com.clg.consistify.DTO.RegisterBody;
import com.clg.consistify.DTO.UserDTO;
import com.clg.consistify.exception.UserAlreadyExistException;
import com.clg.consistify.exception.UserNotFoundException;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.MyUserDetailService;
import com.clg.consistify.user.UserModel;
import com.clg.consistify.utils.JwtUtils;
import com.clg.consistify.utils.XpRankEvaluator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class UserService extends XpRankEvaluator {
    @Autowired
    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;


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
        user.setRank(body.getRank());
        user.setRole(body.getRole());
        user.setXp(body.getXp());

        UserModel savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailService.loadUserByUsername(savedUser.getUsername());
        String jwt = jwtUtil.generateToken(savedUser.getUsername());

        CompletableFuture.runAsync(() -> {
            try {
                sendWelcomeEmail(savedUser.getEmail());
            } catch (Exception e) {
                System.err.println("Failed to send welcome email: " + e.getMessage());
            }
        });
        return jwt;
    }

    public void sendWelcomeEmail(String toEmail) {
        toEmail = toEmail.trim().replaceAll("[\\r\\n]", "");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("sub..");
        message.setText("text..");
        message.setFrom("yvksmr@gmail.com.com");
        mailSender.send(message);
    }
    public Object[] gettingProfile(){
        String username=SecurityContextHolder.getContext().getAuthentication().getName();
        UserModel user=userRepository.findByUsername(username)
                .orElseThrow(()-> new UserNotFoundException("User not found"));
        Long id=user.getId();
        return userRepository.getProfile(id);
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
    @Transactional(readOnly = true)
    public UserDTO getUser(){
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        UserModel user=userRepository.findByUsername(username)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));
        UserDTO getUser=new UserDTO();
        getUser.setRank(user.getRank());
        getUser.setUsername(username);
        getUser.setEmail(user.getEmail());
        getUser.setFriends(user.getFriends().stream().map(UserModel::getUsername).toList());
        return getUser;
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

    @Override
    public void evaluateRank(UserModel user) {
        user.setRank(calculateRank(user.getXp()));

    }
}

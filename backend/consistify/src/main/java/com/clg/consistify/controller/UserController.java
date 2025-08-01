package com.clg.consistify.controller;

import com.clg.consistify.DTO.*;
import com.clg.consistify.exception.UserNotFoundException;
import com.clg.consistify.exception.UsernameAlreadyExistException;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.services.ExternalApiService;
import com.clg.consistify.services.UserService;
import com.clg.consistify.user.MyUserDetailService;
import com.clg.consistify.user.UserModel;
import com.clg.consistify.utils.JwtUtils;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173",allowCredentials = "true")

public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtils jwtUtil;


    private final MyUserDetailService userDetailService;

    private final UserRepository userRepository;
    private final ExternalApiService externalApiService;

    public UserController(PasswordEncoder passwordEncoder, MyUserDetailService userDetailService, UserRepository userRepository, ExternalApiService externalApiService, UserService userService) {
        this.userDetailService = userDetailService;
        this.userRepository = userRepository;
        this.externalApiService = externalApiService;
        this.userService = userService;
    }

    private final UserService userService;

    @PostMapping("/register")
    @CacheEvict(value = "users",allEntries = true)
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterBody body) {
        String jwt = userService.register(body);
        externalApiService.createBotUser();
        externalApiService.createConversation();

        return ResponseEntity.ok(Map.of("token", jwt));
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginBody user) {
        String jwt = userService.login(user);
        return ResponseEntity.ok(Map.of("token", jwt));
    }
    @Cacheable("users")
    @GetMapping("/users")
    public List<String> getAllUsers(@RequestParam int pageNo) {
        System.out.println("💡 Getting data from DB... (Not cache)");
        return userRepository.findAll(PageRequest.of(pageNo,5,Sort.by("id")))
                .stream()
                .map(UserModel::getUsername)
                .toList();
    }
    @GetMapping("/users/model")
    public ResponseEntity<List<UserDTO>> getAllUsersModel() {
        return ResponseEntity.ok(getAllUserDTOs());
    }
    @GetMapping("/getUser")
    public ResponseEntity<UserDTO> findUser(){
        UserDTO user=userService.getUser();
        return ResponseEntity.ok(user);
    }
    @Cacheable("usersModel")
    public List<UserDTO> getAllUserDTOs() {
        List<UserModel> users = userRepository.findAll();

        return users.stream()
                .map(user -> new UserDTO(
                        user.getUsername(),
                        user.getEmail(),
                        user.getFriendRequests() != null ? user.getFriendRequests() : List.of(),
                        user.getFriends() != null
                                ? user.getFriends().stream()
                                .map(UserModel::getUsername)
                                .toList()
                                : List.of()
                ))
                .toList();
    }

    @GetMapping("/users/friends")
    public ResponseEntity<List<String>> getFriends(Authentication authentication) {
        String jwtUsername = authentication.getName();
        List<String> friends = userService.getFriendUsernames(jwtUsername);
        return ResponseEntity.ok(friends);
    }
    @PostMapping("/users/send-request/{toUserName}")
    public ResponseEntity<String> sendFriendRequest(@PathVariable String toUserName,Authentication authentication) {
        String fromUserId=authentication.getName();
        return userService.friendRequest(fromUserId, toUserName);
    }

    @PostMapping("/users/{friendId}/accept-request")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable String friendId, Authentication authentication) {
        String currentUserId = authentication.getName(); // 

        if (!userService.hasRequestFrom(friendId, currentUserId)) {
            return ResponseEntity.badRequest().body("No such friend request found");
        }

        userService.acceptRequest(friendId, currentUserId);
        return ResponseEntity.ok("Friend request accepted");
    }
    @GetMapping("/users/requests")
    public ResponseEntity<List<String>> seeRequests(){
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<UserModel> OptUser=userRepository.findByUsername(username);

        if(OptUser.isPresent()){
            UserModel user=OptUser.get();
            List<String> requests=user.getFriendRequests();
            return ResponseEntity.ok(requests);
        }
        return ResponseEntity.ok(null);
    }
    @GetMapping("/users/search")
    public ResponseEntity<List<String>> searchUsername(@RequestParam String username){
        List<UserModel> users=userService.getByUsername(username);
        List<String> userNames=users
                .stream()
                .map(UserModel::getUsername)
                .toList();
        return ResponseEntity.ok(userNames);
    }
    @Async
    @PostMapping("/email")
    public void sendEmail(@RequestBody EmailDTO body){
        System.out.println(Thread.currentThread().getName());
        System.out.println("Sending email to: " + body.getEmail());
        userService.sendWelcomeEmail(body.getEmail());
    }
    @GetMapping("/profile")
    public Object[] findProfile(){
        return userService.gettingProfile();
    }
}

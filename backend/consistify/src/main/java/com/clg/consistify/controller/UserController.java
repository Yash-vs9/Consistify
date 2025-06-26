package com.clg.consistify.controller;

import com.clg.consistify.DTO.LoginBody;
import com.clg.consistify.DTO.RegisterBody;
import com.clg.consistify.DTO.TwoFriends;
import com.clg.consistify.DTO.UserDTO;
import com.clg.consistify.exception.UserNotFoundException;
import com.clg.consistify.exception.UsernameAlreadyExistException;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.services.UserService;
import com.clg.consistify.user.MyUserDetailService;
import com.clg.consistify.user.UserModel;
import com.clg.consistify.utils.JwtUtils;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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


    public UserController(PasswordEncoder passwordEncoder, MyUserDetailService userDetailService, UserRepository userRepository, UserService userService) {
        this.userDetailService = userDetailService;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    private final UserService userService;

    @PostMapping("/register")
    @CacheEvict(value = "users",allEntries = true)
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterBody body) {
        String jwt = userService.register(body);
        return ResponseEntity.ok(Map.of("token", jwt));
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginBody user) {
        String jwt = userService.login(user);
        return ResponseEntity.ok(Map.of("token", jwt));
    }
    @Cacheable("users")
    @GetMapping("/users")
    public List<String> getAllUsers() {
        System.out.println("💡 Getting data from DB... (Not cache)");
        return userRepository.findAll()
                .stream()
                .map(UserModel::getUsername)
                .toList();
    }
    @Cacheable("usersModel")
    @GetMapping("/users/model")
    public ResponseEntity<List<UserDTO>> getAllUsersModel() {
        List<UserModel> users = userRepository.findAll();

        List<UserDTO> userDTOs = users.stream()
                .map(user -> new UserDTO(
                        user.getUsername(),
                        user.getEmail(),
                        user.getFriendRequests(), // already List<String>
                        user.getFriends().stream()
                                .map(UserModel::getUsername)
                                .toList()
                ))
                .toList();

        return ResponseEntity.ok(userDTOs);
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
    //NOT VERIFIED YET
    @PostMapping("/users/{friendId}/accept-request")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable String friendId, Authentication authentication) {
        String currentUserId = authentication.getName(); // 
        //HasReqFrom is in service
        if (!userService.hasRequestFrom(friendId, currentUserId)) {
            return ResponseEntity.badRequest().body("No such friend request found");
        }

        userService.acceptRequest(friendId, currentUserId);
        return ResponseEntity.ok("Friend request accepted");
    }
    @GetMapping("/users/requests/{userId}")
    public ResponseEntity<List<String>> seeRequests(@PathVariable String userId){
        Optional<UserModel> OptUser=userRepository.findByUsername(userId);

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
}

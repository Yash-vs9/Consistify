package com.clg.consistify.DTO;

import com.clg.consistify.user.UserModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterBody {
    private String username;
    private String email;
    private String password;
    private String role = "USER";
    private String xp = "E";
    private Set<UserModel> friends = null;
}
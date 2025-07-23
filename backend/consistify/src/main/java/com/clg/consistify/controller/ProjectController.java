package com.clg.consistify.controller;

import com.clg.consistify.DTO.ProjectBody;
import com.clg.consistify.repository.ProjectRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.ProjectModel;
import com.clg.consistify.user.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;
    @PostMapping("/project")
    public ResponseEntity<?> createProject(@RequestBody ProjectBody body) {
        UserModel user = userRepository.findById(body.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ProjectModel project = new ProjectModel();
        project.setProjectGroup(body.getProjectGroup());
        project.setProjectName(body.getProjectName());
        project.setProjectDescription(body.getProjectDescription());
        project.setCollaborators(body.getCollaborators());
        project.setUser(user);
        user.getProjects().add(project);
        projectRepository.save(project);
        userRepository.save(user);

        return ResponseEntity.ok(project);
    }
}

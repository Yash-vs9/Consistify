package com.clg.consistify.repository;

import com.clg.consistify.user.ProjectModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<ProjectModel,String> {
    
}

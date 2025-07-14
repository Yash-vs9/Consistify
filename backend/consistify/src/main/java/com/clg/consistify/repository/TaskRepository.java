package com.clg.consistify.repository;

import com.clg.consistify.user.TaskModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<TaskModel,Long> {


}

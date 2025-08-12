package com.clg.consistify.repository;

import com.clg.consistify.user.TaskModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TaskRepository extends JpaRepository<TaskModel,Long> {
    @Query("SELECT t FROM TaskModel t JOIN t.user u WHERE LOWER(t.taskName) = LOWER(:taskName) AND u.username = :username")
    Optional<TaskModel> findByTaskNameAndUsername(@Param("taskName") String taskName, @Param("username") String username);

}

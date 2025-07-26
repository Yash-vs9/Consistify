package com.clg.consistify.repository;


import com.clg.consistify.DTO.ProfileDTO;
import com.clg.consistify.user.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<UserModel,Long> {
    Optional<UserModel> findByEmail(String email);

    Optional<UserModel> findByUsername(String username);

    @Query("SELECT u FROM UserModel u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :username ,'%'))")
    List<UserModel> searchByUsername(@Param("username") String username);

    @Query(value = """
    SELECT\s
        u.username,\s
        u.xp,\s
        (SELECT COUNT(*) FROM user_tasks t WHERE t.user_id = :id) AS task_count,
        (SELECT COUNT(*) FROM user_friends f WHERE f.user_id = :id) AS friend_count
    FROM users u\s
    WHERE u.id = :id
""", nativeQuery = true)
    Object[] getProfile(@Param("id") Long id);
}
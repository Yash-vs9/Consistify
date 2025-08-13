package com.clg.consistify.repository;

import com.clg.consistify.user.QueryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface QueryRepository extends JpaRepository<QueryModel, Long> {
    @Query("""
    SELECT q FROM QueryModel q
    JOIN q.user u
    WHERE LOWER(TRIM(q.name)) = LOWER(TRIM(:name))
      AND LOWER(TRIM(u.username)) = LOWER(TRIM(:username))
""")
    Optional<QueryModel> findByNameIgnoreCaseAndUsernameIgnoreCase(
            @Param("name") String name,
            @Param("username") String username
    );

}

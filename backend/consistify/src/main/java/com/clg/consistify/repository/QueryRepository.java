package com.clg.consistify.repository;

import com.clg.consistify.user.QueryModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueryRepository extends JpaRepository<QueryModel, Long> {
}

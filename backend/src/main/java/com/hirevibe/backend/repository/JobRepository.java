package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JobRepository
        extends JpaRepository<Job, Long>,
        JpaSpecificationExecutor<Job> {

    long countByActiveTrue();
}
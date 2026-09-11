package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.Application;
import com.hirevibe.backend.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ApplicationRepository
        extends JpaRepository<Application, Long>,
        JpaSpecificationExecutor<Application> {

    long countByStatus(
            ApplicationStatus status
    );
}
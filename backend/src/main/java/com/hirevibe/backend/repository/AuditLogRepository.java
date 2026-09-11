package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long>,
        JpaSpecificationExecutor<AuditLog> {
}
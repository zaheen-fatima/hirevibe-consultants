package com.hirevibe.backend.dto.audit;

import com.hirevibe.backend.entity.AuditAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {

    private Long id;

    private Long userId;

    private String userEmail;

    private AuditAction action;

    private String entityType;

    private String entityId;

    private String description;

    private String ipAddress;

    private String userAgent;

    private String metadata;

    private String beforeState;

    private String afterState;

    private String changedFields;

    private Instant createdAt;
}
package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.audit.AuditLogResponse;
import com.hirevibe.backend.entity.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLogResponse toResponse(
            AuditLog auditLog
    ) {

        return AuditLogResponse.builder()
                .id(auditLog.getId())

                .userId(
                        auditLog.getUser() != null
                                ? auditLog.getUser().getId()
                                : null
                )

                .userEmail(auditLog.getUserEmail())

                .action(auditLog.getAction())

                .entityType(auditLog.getEntityType())

                .entityId(auditLog.getEntityId())

                .description(auditLog.getDescription())

                .ipAddress(auditLog.getIpAddress())

                .userAgent(auditLog.getUserAgent())

                .metadata(auditLog.getMetadata())

                .beforeState(
                        auditLog.getBeforeState()
                )

                .afterState(
                        auditLog.getAfterState()
                )

                .changedFields(
                        auditLog.getChangedFields()
                )

                .createdAt(
                        auditLog.getCreatedAt()
                )

                .build();
    }
}
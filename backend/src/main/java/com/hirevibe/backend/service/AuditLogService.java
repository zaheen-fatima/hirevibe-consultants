package com.hirevibe.backend.service;

import com.hirevibe.backend.dto.audit.AuditLogResponse;
import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.entity.AuditLog;
import com.hirevibe.backend.entity.User;
import com.hirevibe.backend.mapper.AuditLogMapper;
import com.hirevibe.backend.repository.AuditLogRepository;
import com.hirevibe.backend.repository.UserRepository;
import com.hirevibe.backend.specification.AuditLogSpecification;
import com.hirevibe.backend.util.AuditContext;
import com.hirevibe.backend.util.AuditRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final AuditLogMapper auditLogMapper;
    private final AuditChangeTrackingService auditChangeTrackingService;

    /**
     * Records a generic audit entry.
     *
     * Used by the HTTP audit interceptor for operations
     * that do not require before/after state tracking.
     */
    @Transactional
    public void record(
            AuditAction action,
            String entityType,
            String entityId,
            String description,
            String metadata,
            HttpServletRequest request
    ) {
        AuditLog auditLog = buildAuditLog(
                action,
                entityType,
                entityId,
                description,
                metadata,
                request
        );

        auditLogRepository.save(auditLog);
    }

    /**
     * Records a detailed update/change audit.
     */
    @Transactional
    public void recordChange(
            AuditAction action,
            String entityType,
            String entityId,
            String description,
            Object before,
            Object after,
            HttpServletRequest request
    ) {
        AuditChangeTrackingService.ChangeSnapshot snapshot =
                auditChangeTrackingService.createSnapshot(
                        before,
                        after
                );

        recordChangeSnapshot(
                action,
                entityType,
                entityId,
                description,
                snapshot,
                request
        );
    }

    /**
     * Request-aware overload.
     *
     * Keeps business-service method signatures clean.
     */
    @Transactional
    public void recordChange(
            AuditAction action,
            String entityType,
            String entityId,
            String description,
            Object before,
            Object after
    ) {
        recordChange(
                action,
                entityType,
                entityId,
                description,
                before,
                after,
                currentRequest()
        );
    }

    /**
     * Records CREATE operation.
     *
     * CREATE has no before state.
     */
    @Transactional
    public void recordCreate(
            AuditAction action,
            String entityType,
            String entityId,
            String description,
            Object after,
            HttpServletRequest request
    ) {
        String afterState =
                auditChangeTrackingService.snapshotAfter(after);

        AuditLog auditLog = buildAuditLog(
                action,
                entityType,
                entityId,
                description,
                null,
                request
        );

        auditLog.setBeforeState(null);
        auditLog.setAfterState(afterState);
        auditLog.setChangedFields(null);

        auditLogRepository.save(auditLog);

        markDetailedAuditRecorded(request);
    }

    /**
     * Request-aware CREATE overload.
     */
    @Transactional
    public void recordCreate(
            AuditAction action,
            String entityType,
            String entityId,
            String description,
            Object after
    ) {
        recordCreate(
                action,
                entityType,
                entityId,
                description,
                after,
                currentRequest()
        );
    }

    /**
     * Records DELETE operation.
     *
     * DELETE has a before state but no after state.
     */
    @Transactional
    public void recordDelete(
            AuditAction action,
            String entityType,
            String entityId,
            String description,
            Object before,
            HttpServletRequest request
    ) {
        String beforeState =
                auditChangeTrackingService.snapshotBefore(before);

        AuditLog auditLog = buildAuditLog(
                action,
                entityType,
                entityId,
                description,
                null,
                request
        );

        auditLog.setBeforeState(beforeState);
        auditLog.setAfterState(null);
        auditLog.setChangedFields(null);

        auditLogRepository.save(auditLog);

        markDetailedAuditRecorded(request);
    }

    /**
     * Request-aware DELETE overload.
     */
    @Transactional
    public void recordDelete(
            AuditAction action,
            String entityType,
            String entityId,
            String description,
            Object before
    ) {
        recordDelete(
                action,
                entityType,
                entityId,
                description,
                before,
                currentRequest()
        );
    }

    /**
     * Persists a pre-built change snapshot.
     */
    @Transactional
    public void recordChangeSnapshot(
            AuditAction action,
            String entityType,
            String entityId,
            String description,
            AuditChangeTrackingService.ChangeSnapshot snapshot,
            HttpServletRequest request
    ) {
        if (snapshot == null) {
            throw new IllegalArgumentException(
                    "Audit change snapshot must not be null"
            );
        }

        AuditLog auditLog = buildAuditLog(
                action,
                entityType,
                entityId,
                description,
                null,
                request
        );

        auditLog.setBeforeState(snapshot.beforeState());
        auditLog.setAfterState(snapshot.afterState());
        auditLog.setChangedFields(snapshot.changedFields());

        auditLogRepository.save(auditLog);

        markDetailedAuditRecorded(request);
    }

    /**
     * Paginated and filtered audit-log retrieval.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('AUDIT_READ')")
    public Page<AuditLogResponse> getAuditLogs(
            AuditAction action,
            String entityType,
            String entityId,
            Long userId,
            Pageable pageable
    ) {
        Specification<AuditLog> specification =
                Specification.allOf(
                        AuditLogSpecification.hasAction(action),
                        AuditLogSpecification.hasEntityType(entityType),
                        AuditLogSpecification.hasEntityId(entityId),
                        AuditLogSpecification.hasUserId(userId)
                );

        return auditLogRepository
                .findAll(specification, pageable)
                .map(auditLogMapper::toResponse);
    }

    private AuditLog buildAuditLog(
            AuditAction action,
            String entityType,
            String entityId,
            String description,
            String metadata,
            HttpServletRequest request
    ) {
        Long userId = AuditContext.currentUserId();
        String userEmail = AuditContext.currentUserEmail();

        User user = null;

        if (userId != null) {
            user = userRepository
                    .findById(userId)
                    .orElse(null);
        }

        return AuditLog.builder()
                .user(user)
                .userEmail(userEmail)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .metadata(metadata)
                .ipAddress(AuditContext.ipAddress(request))
                .userAgent(AuditContext.userAgent(request))
                .build();
    }

    /**
     * Prevents the generic HTTP audit interceptor
     * from creating a duplicate audit entry.
     */
    private void markDetailedAuditRecorded(
            HttpServletRequest request
    ) {
        if (request == null) {
            return;
        }

        request.setAttribute(
                AuditRequestAttributes.DETAILED_AUDIT_RECORDED,
                Boolean.TRUE
        );
    }

    /**
     * Resolves the current servlet request when a service
     * method uses the request-independent overload.
     */
    private HttpServletRequest currentRequest() {
        RequestAttributes attributes =
                RequestContextHolder.getRequestAttributes();

        if (attributes instanceof ServletRequestAttributes servletAttributes) {
            return servletAttributes.getRequest();
        }

        return null;
    }
}
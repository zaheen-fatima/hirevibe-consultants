package com.hirevibe.backend.specification;

import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.entity.AuditLog;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class AuditLogSpecification {

    private AuditLogSpecification() {
    }

    public static Specification<AuditLog> hasAction(
            AuditAction action
    ) {

        return (root, query, criteriaBuilder) ->
                action == null
                        ? null
                        : criteriaBuilder.equal(
                        root.get("action"),
                        action
                );
    }

    public static Specification<AuditLog> hasEntityType(
            String entityType
    ) {

        return (root, query, criteriaBuilder) ->
                !StringUtils.hasText(entityType)
                        ? null
                        : criteriaBuilder.equal(
                        criteriaBuilder.lower(
                                root.get("entityType")
                        ),
                        entityType
                        .trim()
                        .toLowerCase()
                );
    }

    public static Specification<AuditLog> hasEntityId(
            String entityId
    ) {

        return (root, query, criteriaBuilder) ->
                !StringUtils.hasText(entityId)
                        ? null
                        : criteriaBuilder.equal(
                        root.get("entityId"),
                        entityId.trim()
                );
    }

    public static Specification<AuditLog> hasUserId(
            Long userId
    ) {

        return (root, query, criteriaBuilder) ->
                userId == null
                        ? null
                        : criteriaBuilder.equal(
                        root.get("user").get("id"),
                        userId
                );
    }
}
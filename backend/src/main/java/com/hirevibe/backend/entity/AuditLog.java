package com.hirevibe.backend.entity;

import jakarta.persistence.*;
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
@Entity
@Table(
        name = "audit_logs",
        indexes = {
                @Index(
                        name = "idx_audit_logs_user_id",
                        columnList = "user_id"
                ),
                @Index(
                        name = "idx_audit_logs_action",
                        columnList = "action"
                ),
                @Index(
                        name = "idx_audit_logs_entity_type",
                        columnList = "entity_type"
                ),
                @Index(
                        name = "idx_audit_logs_entity_id",
                        columnList = "entity_id"
                ),
                @Index(
                        name = "idx_audit_logs_created_at",
                        columnList = "created_at"
                ),
                @Index(
                        name = "idx_audit_logs_user_created",
                        columnList = "user_id, created_at"
                )
        }
)
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            foreignKey = @ForeignKey(
                    name = "fk_audit_logs_user"
            )
    )
    private User user;

    @Column(name = "user_email", length = 255)
    private String userEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AuditAction action;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @Column(length = 500)
    private String description;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(columnDefinition = "json")
    private String metadata;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @Column(
            name = "before_state",
            columnDefinition = "json"
    )
    private String beforeState;

    @Column(
            name = "after_state",
            columnDefinition = "json"
    )
    private String afterState;

    @Column(
            name = "changed_fields",
            columnDefinition = "json"
    )
    private String changedFields;
    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
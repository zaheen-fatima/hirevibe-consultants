package com.hirevibe.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "inquiries")
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 150
    )
    private String name;

    @Column(
            nullable = false,
            length = 255
    )
    private String email;

    @Column(
            nullable = false,
            length = 30
    )
    private String phone;

    @Column(
            length = 200
    )
    private String company;

    @Column(
            name = "service_type",
            nullable = false,
            length = 100
    )
    private String serviceType;

    @Column(
            name = "hiring_requirement",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String hiringRequirement;

    @Column(
            length = 200
    )
    private String location;

    @Column(
            nullable = false,
            length = 200
    )
    private String subject;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    @Builder.Default
    private InquiryStatus status = InquiryStatus.NEW;

    @Column(
            name = "admin_reply",
            columnDefinition = "TEXT"
    )
    private String adminReply;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {

        Instant now = Instant.now();

        if (createdAt == null) {
            createdAt = now;
        }

        updatedAt = now;

        if (status == null) {
            status = InquiryStatus.NEW;
        }
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = Instant.now();
    }
}
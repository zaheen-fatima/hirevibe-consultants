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
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 150
    )
    private String name;

    @Column(
            name = "role_title",
            length = 150
    )
    private String roleTitle;

    @Column(
            length = 200
    )
    private String company;

    @Column(
            nullable = false
    )
    private Integer rating;

    @Column(
            name = "review_text",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String reviewText;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    @Builder.Default
    private ReviewStatus status = ReviewStatus.PENDING;

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
            status = ReviewStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = Instant.now();
    }
}
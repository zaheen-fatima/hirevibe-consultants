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
@Table(
        name = "articles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_articles_slug",
                        columnNames = "slug"
                )
        }
)
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 200
    )
    private String title;

    @Column(
            nullable = false,
            length = 220
    )
    private String slug;

    @Column(
            length = 500
    )
    private String excerpt;

    @Column(
            nullable = false,
            columnDefinition = "LONGTEXT"
    )
    private String content;

    @Column(
            nullable = false,
            length = 100
    )
    private String category;

    @Column(
            name = "featured_image",
            length = 500
    )
    private String featuredImage;

    @Builder.Default
    @Column(nullable = false)
    private boolean published = false;

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

    @Column(name = "published_at")
    private Instant publishedAt;

    @PrePersist
    protected void onCreate() {

        Instant now = Instant.now();

        if (createdAt == null) {
            createdAt = now;
        }

        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = Instant.now();
    }
}
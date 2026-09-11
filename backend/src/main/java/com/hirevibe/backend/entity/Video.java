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
        name = "videos",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_videos_slug",
                        columnNames = "slug"
                )
        }
)
public class Video {

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

    @Column(length = 1000)
    private String description;

    @Column(
            name = "video_url",
            nullable = false,
            length = 1000
    )
    private String videoUrl;

    @Column(
            name = "thumbnail_url",
            length = 1000
    )
    private String thumbnailUrl;

    @Column(
            nullable = false,
            length = 100
    )
    private String category;

    @Builder.Default
    @Column(nullable = false)
    private boolean published = false;

    @Builder.Default
    @Column(nullable = false)
    private boolean featured = false;

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
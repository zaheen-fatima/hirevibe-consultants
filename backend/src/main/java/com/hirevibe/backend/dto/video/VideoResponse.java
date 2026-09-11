package com.hirevibe.backend.dto.video;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoResponse {

    private Long id;

    private String title;

    private String slug;

    private String description;

    private String videoUrl;

    private String thumbnailUrl;

    private String category;

    private boolean published;

    private boolean featured;

    private Instant createdAt;

    private Instant updatedAt;

    private Instant publishedAt;
}
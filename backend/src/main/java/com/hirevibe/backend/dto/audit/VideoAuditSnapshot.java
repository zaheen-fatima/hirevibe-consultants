package com.hirevibe.backend.dto.audit;

import com.hirevibe.backend.entity.Video;

import java.time.Instant;

public record VideoAuditSnapshot(
        Long id,
        String title,
        String slug,
        String description,
        String videoUrl,
        String thumbnailUrl,
        String category,
        boolean published,
        boolean featured,
        Instant publishedAt
) {

    public static VideoAuditSnapshot from(
            Video video
    ) {

        return new VideoAuditSnapshot(
                video.getId(),
                video.getTitle(),
                video.getSlug(),
                video.getDescription(),
                video.getVideoUrl(),
                video.getThumbnailUrl(),
                video.getCategory(),
                video.isPublished(),
                video.isFeatured(),
                video.getPublishedAt()
        );
    }
}
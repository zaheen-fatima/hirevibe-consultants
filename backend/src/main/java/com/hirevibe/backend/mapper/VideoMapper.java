package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.video.VideoResponse;
import com.hirevibe.backend.entity.Video;
import org.springframework.stereotype.Component;

@Component
public class VideoMapper {

    public VideoResponse toResponse(
            Video video
    ) {

        return VideoResponse.builder()
                .id(video.getId())
                .title(video.getTitle())
                .slug(video.getSlug())
                .description(video.getDescription())
                .videoUrl(video.getVideoUrl())
                .thumbnailUrl(video.getThumbnailUrl())
                .category(video.getCategory())
                .published(video.isPublished())
                .featured(video.isFeatured())
                .createdAt(video.getCreatedAt())
                .updatedAt(video.getUpdatedAt())
                .publishedAt(video.getPublishedAt())
                .build();
    }
}
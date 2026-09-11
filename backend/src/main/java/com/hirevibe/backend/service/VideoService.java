package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.audit.VideoAuditSnapshot;
import com.hirevibe.backend.dto.video.CreateVideoRequest;
import com.hirevibe.backend.dto.video.UpdateVideoRequest;
import com.hirevibe.backend.dto.video.VideoResponse;
import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.entity.Video;
import com.hirevibe.backend.mapper.VideoMapper;
import com.hirevibe.backend.repository.VideoRepository;
import com.hirevibe.backend.specification.VideoSpecification;
import com.hirevibe.backend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper;
    private final AuditLogService auditLogService;

    /**
     * Creates a new video.
     */
    @Transactional
    @PreAuthorize("hasAuthority('VIDEO_CREATE')")
    public VideoResponse createVideo(
            CreateVideoRequest request
    ) {
        String slug =
                generateUniqueSlug(
                        request.getTitle(),
                        null
                );

        Video video = Video.builder()
                .title(normalize(request.getTitle()))
                .slug(slug)
                .description(
                        normalizeNullable(
                                request.getDescription()
                        )
                )
                .videoUrl(
                        normalize(request.getVideoUrl())
                )
                .thumbnailUrl(
                        normalizeNullable(
                                request.getThumbnailUrl()
                        )
                )
                .category(
                        normalize(request.getCategory())
                )
                .published(false)
                .featured(false)
                .build();

        Video savedVideo =
                videoRepository.save(video);

        auditLogService.recordCreate(
                AuditAction.CREATE,
                "VIDEO",
                savedVideo.getId().toString(),
                "Created video #" + savedVideo.getId(),
                VideoAuditSnapshot.from(savedVideo)
        );

        return videoMapper.toResponse(savedVideo);
    }

    /**
     * Paginated and filtered admin video list.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('VIDEO_READ')")
    public Page<VideoResponse> getVideos(
            String title,
            String category,
            Boolean published,
            Boolean featured,
            Pageable pageable
    ) {
        Specification<Video> specification =
                Specification.allOf(
                        VideoSpecification.hasTitle(title),
                        VideoSpecification.hasCategory(category),
                        VideoSpecification.isPublished(published),
                        VideoSpecification.isFeatured(featured)
                );

        return videoRepository
                .findAll(specification, pageable)
                .map(videoMapper::toResponse);
    }

    /**
     * Public published-video listing.
     */
    @Transactional(readOnly = true)
    public Page<VideoResponse> getPublicVideos(
            String category,
            Pageable pageable
    ) {
        Specification<Video> specification =
                Specification.allOf(
                        VideoSpecification.hasCategory(category),
                        VideoSpecification.isPublished(true)
                );

        return videoRepository
                .findAll(specification, pageable)
                .map(videoMapper::toResponse);
    }

    /**
     * Public video retrieval by slug.
     */
    @Transactional(readOnly = true)
    public VideoResponse getPublicVideoBySlug(
            String slug
    ) {
        Video video =
                videoRepository
                        .findBySlug(
                                slug
                                        .trim()
                                        .toLowerCase(Locale.ROOT)
                        )
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Video not found"
                                )
                        );

        if (!video.isPublished()) {
            throw new ResourceNotFoundException(
                    "Video not found"
            );
        }

        return videoMapper.toResponse(video);
    }

    /**
     * Admin video retrieval.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('VIDEO_READ')")
    public VideoResponse getVideo(Long id) {
        return videoMapper.toResponse(
                getVideoEntity(id)
        );
    }

    /**
     * Updates video metadata.
     */
    @Transactional
    @PreAuthorize("hasAuthority('VIDEO_UPDATE')")
    public VideoResponse updateVideo(
            Long id,
            UpdateVideoRequest request
    ) {
        Video video =
                getVideoEntity(id);

        VideoAuditSnapshot before =
                VideoAuditSnapshot.from(video);

        String title =
                normalize(request.getTitle());

        if (!video.getTitle().equals(title)) {
            video.setSlug(
                    generateUniqueSlug(
                            title,
                            id
                    )
            );
        }

        video.setTitle(title);

        video.setDescription(
                normalizeNullable(
                        request.getDescription()
                )
        );

        video.setVideoUrl(
                normalize(request.getVideoUrl())
        );

        video.setThumbnailUrl(
                normalizeNullable(
                        request.getThumbnailUrl()
                )
        );

        video.setCategory(
                normalize(request.getCategory())
        );

        Video savedVideo =
                videoRepository.save(video);

        auditLogService.recordChange(
                AuditAction.UPDATE,
                "VIDEO",
                savedVideo.getId().toString(),
                "Updated video #" + savedVideo.getId(),
                before,
                VideoAuditSnapshot.from(savedVideo)
        );

        return videoMapper.toResponse(savedVideo);
    }

    /**
     * Publishes a video.
     */
    @Transactional
    @PreAuthorize("hasAuthority('VIDEO_UPDATE')")
    public VideoResponse publishVideo(Long id) {

        Video video =
                getVideoEntity(id);

        VideoAuditSnapshot before =
                VideoAuditSnapshot.from(video);

        video.setPublished(true);

        if (video.getPublishedAt() == null) {
            video.setPublishedAt(
                    Instant.now()
            );
        }

        Video savedVideo =
                videoRepository.save(video);

        auditLogService.recordChange(
                AuditAction.PUBLISH,
                "VIDEO",
                savedVideo.getId().toString(),
                "Published video #" + savedVideo.getId(),
                before,
                VideoAuditSnapshot.from(savedVideo)
        );

        return videoMapper.toResponse(savedVideo);
    }

    /**
     * Unpublishes a video.
     */
    @Transactional
    @PreAuthorize("hasAuthority('VIDEO_UPDATE')")
    public VideoResponse unpublishVideo(Long id) {

        Video video =
                getVideoEntity(id);

        VideoAuditSnapshot before =
                VideoAuditSnapshot.from(video);

        video.setPublished(false);
        video.setPublishedAt(null);

        Video savedVideo =
                videoRepository.save(video);

        auditLogService.recordChange(
                AuditAction.UNPUBLISH,
                "VIDEO",
                savedVideo.getId().toString(),
                "Unpublished video #" + savedVideo.getId(),
                before,
                VideoAuditSnapshot.from(savedVideo)
        );

        return videoMapper.toResponse(savedVideo);
    }

    /**
     * Marks a video as featured.
     */
    @Transactional
    @PreAuthorize("hasAuthority('VIDEO_UPDATE')")
    public VideoResponse featureVideo(Long id) {

        Video video =
                getVideoEntity(id);

        VideoAuditSnapshot before =
                VideoAuditSnapshot.from(video);

        video.setFeatured(true);

        Video savedVideo =
                videoRepository.save(video);

        auditLogService.recordChange(
                AuditAction.ACTIVATE,
                "VIDEO",
                savedVideo.getId().toString(),
                "Featured video #" + savedVideo.getId(),
                before,
                VideoAuditSnapshot.from(savedVideo)
        );

        return videoMapper.toResponse(savedVideo);
    }

    /**
     * Removes featured status from a video.
     */
    @Transactional
    @PreAuthorize("hasAuthority('VIDEO_UPDATE')")
    public VideoResponse unfeatureVideo(Long id) {

        Video video =
                getVideoEntity(id);

        VideoAuditSnapshot before =
                VideoAuditSnapshot.from(video);

        video.setFeatured(false);

        Video savedVideo =
                videoRepository.save(video);

        auditLogService.recordChange(
                AuditAction.DEACTIVATE,
                "VIDEO",
                savedVideo.getId().toString(),
                "Unfeatured video #" + savedVideo.getId(),
                before,
                VideoAuditSnapshot.from(savedVideo)
        );

        return videoMapper.toResponse(savedVideo);
    }

    /**
     * Permanently deletes a video.
     */
    @Transactional
    @PreAuthorize("hasAuthority('VIDEO_DELETE')")
    public void deleteVideo(Long id) {

        Video video =
                getVideoEntity(id);

        VideoAuditSnapshot before =
                VideoAuditSnapshot.from(video);

        videoRepository.delete(video);

        auditLogService.recordDelete(
                AuditAction.DELETE,
                "VIDEO",
                id.toString(),
                "Deleted video #" + id,
                before
        );
    }

    /**
     * Internal entity lookup.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('VIDEO_READ')")
    public Video getVideoEntity(Long id) {

        return videoRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Video not found with ID: " + id
                        )
                );
    }

    /**
     * Generates a unique SEO-friendly slug.
     */
    private String generateUniqueSlug(
            String title,
            Long currentId
    ) {
        String baseSlug =
                SlugUtil.generateSlug(title);

        if (!videoRepository.existsBySlug(baseSlug)) {
            return baseSlug;
        }

        if (currentId != null
                && !videoRepository.existsBySlugAndIdNot(
                baseSlug,
                currentId
        )) {
            return baseSlug;
        }

        int counter = 2;

        String candidate;

        do {
            candidate =
                    baseSlug + "-" + counter;
            counter++;

        } while (
                videoRepository.existsBySlug(candidate)
        );

        return candidate;
    }

    private String normalize(String value) {
        return value.trim();
    }

    private String normalizeNullable(String value) {

        if (value == null) {
            return null;
        }

        String normalized =
                value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }
}
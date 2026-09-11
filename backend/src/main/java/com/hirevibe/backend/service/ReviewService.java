package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.audit.ReviewAuditSnapshot;
import com.hirevibe.backend.dto.review.CreateReviewRequest;
import com.hirevibe.backend.dto.review.ReviewResponse;
import com.hirevibe.backend.dto.review.UpdateReviewStatusRequest;
import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.entity.Review;
import com.hirevibe.backend.entity.ReviewStatus;
import com.hirevibe.backend.mapper.ReviewMapper;
import com.hirevibe.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final AuditLogService auditLogService;

    @Transactional
    public ReviewResponse createReview(
            CreateReviewRequest request
    ) {

        Review review = Review.builder()
                .name(normalize(request.getName()))
                .roleTitle(normalizeNullable(request.getRoleTitle()))
                .company(normalizeNullable(request.getCompany()))
                .rating(request.getRating())
                .reviewText(request.getReviewText().trim())
                .status(ReviewStatus.PENDING)
                .build();

        Review savedReview =
                reviewRepository.save(review);

        auditLogService.recordCreate(
                AuditAction.CREATE,
                "REVIEW",
                savedReview.getId().toString(),
                "Created review #" + savedReview.getId(),
                ReviewAuditSnapshot.from(savedReview)
        );

        return reviewMapper.toResponse(savedReview);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getPublicReviews(
            Pageable pageable
    ) {

        return reviewRepository
                .findByStatus(
                        ReviewStatus.APPROVED,
                        pageable
                )
                .map(reviewMapper::toResponse);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('REVIEW_READ')")
    public Page<ReviewResponse> getReviews(
            ReviewStatus status,
            Pageable pageable
    ) {

        Page<Review> reviews =
                status == null
                        ? reviewRepository.findAll(pageable)
                        : reviewRepository.findByStatus(
                        status,
                        pageable
                );

        return reviews.map(
                reviewMapper::toResponse
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('REVIEW_UPDATE')")
    public ReviewResponse updateStatus(
            Long id,
            UpdateReviewStatusRequest request
    ) {

        Review review =
                getReviewEntity(id);

        ReviewAuditSnapshot before =
                ReviewAuditSnapshot.from(review);

        review.setStatus(
                request.getStatus()
        );

        Review savedReview =
                reviewRepository.save(review);

        auditLogService.recordChange(
                AuditAction.STATUS_CHANGE,
                "REVIEW",
                savedReview.getId().toString(),
                "Changed review status for #"
                        + savedReview.getId(),
                before,
                ReviewAuditSnapshot.from(
                        savedReview
                )
        );

        return reviewMapper.toResponse(
                savedReview
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('REVIEW_DELETE')")
    public void deleteReview(Long id) {

        Review review =
                getReviewEntity(id);

        ReviewAuditSnapshot before =
                ReviewAuditSnapshot.from(review);

        reviewRepository.delete(review);

        auditLogService.recordDelete(
                AuditAction.DELETE,
                "REVIEW",
                id.toString(),
                "Deleted review #" + id,
                before
        );
    }

    private Review getReviewEntity(Long id) {

        return reviewRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Review not found with ID: " + id
                        )
                );
    }

    private String normalize(String value) {

        return value.trim();
    }

    private String normalizeNullable(String value) {

        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }
}
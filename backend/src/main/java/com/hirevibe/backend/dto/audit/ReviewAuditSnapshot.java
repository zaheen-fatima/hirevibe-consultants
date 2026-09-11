package com.hirevibe.backend.dto.audit;

import com.hirevibe.backend.entity.Review;

public record ReviewAuditSnapshot(
        Long id,
        String name,
        String roleTitle,
        String company,
        Integer rating,
        String reviewText,
        String status
) {

    public static ReviewAuditSnapshot from(
            Review review
    ) {

        return new ReviewAuditSnapshot(
                review.getId(),
                review.getName(),
                review.getRoleTitle(),
                review.getCompany(),
                review.getRating(),
                review.getReviewText(),
                review.getStatus() != null
                        ? review.getStatus().name()
                        : null
        );
    }
}
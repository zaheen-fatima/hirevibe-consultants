package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.review.ReviewResponse;
import com.hirevibe.backend.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(
            Review review
    ) {

        return ReviewResponse.builder()
                .id(review.getId())
                .name(review.getName())
                .roleTitle(review.getRoleTitle())
                .company(review.getCompany())
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .status(review.getStatus())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
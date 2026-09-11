package com.hirevibe.backend.dto.review;

import com.hirevibe.backend.entity.ReviewStatus;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;

    private String name;

    private String roleTitle;

    private String company;

    private Integer rating;

    private String reviewText;

    private ReviewStatus status;

    private Instant createdAt;

    private Instant updatedAt;
}
package com.hirevibe.backend.dto.review;

import com.hirevibe.backend.entity.ReviewStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateReviewStatusRequest {

    @NotNull(message = "Review status is required")
    private ReviewStatus status;
}
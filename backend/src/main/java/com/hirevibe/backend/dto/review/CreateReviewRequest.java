package com.hirevibe.backend.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {

    @NotBlank(message = "Name is required")
    @Size(
            max = 150,
            message = "Name must not exceed 150 characters"
    )
    private String name;

    @Size(
            max = 150,
            message = "Role title must not exceed 150 characters"
    )
    private String roleTitle;

    @Size(
            max = 200,
            message = "Company must not exceed 200 characters"
    )
    private String company;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;

    @NotBlank(message = "Review is required")
    @Size(
            max = 3000,
            message = "Review must not exceed 3000 characters"
    )
    private String reviewText;
}
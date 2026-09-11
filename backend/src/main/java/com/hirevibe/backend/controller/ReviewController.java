package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.review.CreateReviewRequest;
import com.hirevibe.backend.dto.review.ReviewResponse;
import com.hirevibe.backend.dto.review.UpdateReviewStatusRequest;
import com.hirevibe.backend.entity.ReviewStatus;
import com.hirevibe.backend.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(
        name = "Reviews",
        description = "Public review submission and moderated testimonial management"
)
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(
            summary = "Submit review",
            description = "Submits a review for moderation."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Review submitted successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid review data"
            )
    })
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid
            @RequestBody
            CreateReviewRequest request
    ) {

        return ResponseEntity.ok(
                reviewService.createReview(request)
        );
    }

    @Operation(
            summary = "Get approved public reviews",
            description = "Returns approved testimonials available to website visitors."
    )
    @GetMapping("/public")
    public ResponseEntity<Page<ReviewResponse>> getPublicReviews(
            @PageableDefault(
                    size = 6,
                    sort = "createdAt"
            )
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                reviewService.getPublicReviews(pageable)
        );
    }

    @Operation(
            summary = "Get reviews",
            description = "Returns reviews for administrative moderation."
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<Page<ReviewResponse>> getReviews(
            @RequestParam(required = false)
            ReviewStatus status,

            @PageableDefault(
                    size = 10,
                    sort = "createdAt"
            )
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                reviewService.getReviews(
                        status,
                        pageable
                )
        );
    }

    @Operation(
            summary = "Update review status",
            description = "Approves or rejects a review."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ReviewResponse> updateStatus(
            @PathVariable Long id,

            @Valid
            @RequestBody
            UpdateReviewStatusRequest request
    ) {

        return ResponseEntity.ok(
                reviewService.updateStatus(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Delete review",
            description = "Permanently deletes a review."
    )
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id
    ) {

        reviewService.deleteReview(id);

        return ResponseEntity.noContent().build();
    }
}
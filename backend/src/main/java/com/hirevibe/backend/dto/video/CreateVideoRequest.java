package com.hirevibe.backend.dto.video;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateVideoRequest {

    @NotBlank(message = "Title is required")
    @Size(
            max = 200,
            message = "Title must not exceed 200 characters"
    )
    private String title;

    @Size(
            max = 1000,
            message = "Description must not exceed 1000 characters"
    )
    private String description;

    @NotBlank(message = "Video URL is required")
    @Size(
            max = 1000,
            message = "Video URL must not exceed 1000 characters"
    )
    private String videoUrl;

    @Size(
            max = 1000,
            message = "Thumbnail URL must not exceed 1000 characters"
    )
    private String thumbnailUrl;

    @NotBlank(message = "Category is required")
    @Size(
            max = 100,
            message = "Category must not exceed 100 characters"
    )
    private String category;
}
package com.hirevibe.backend.dto.article;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateArticleRequest {

    @NotBlank(message = "Title is required")
    @Size(
            max = 200,
            message = "Title must not exceed 200 characters"
    )
    private String title;

    @Size(
            max = 500,
            message = "Excerpt must not exceed 500 characters"
    )
    private String excerpt;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Category is required")
    @Size(
            max = 100,
            message = "Category must not exceed 100 characters"
    )
    private String category;

    @Size(
            max = 500,
            message = "Featured image path must not exceed 500 characters"
    )
    private String featuredImage;
}
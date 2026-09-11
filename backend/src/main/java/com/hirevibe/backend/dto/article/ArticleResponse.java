package com.hirevibe.backend.dto.article;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleResponse {

    private Long id;

    private String title;

    private String slug;

    private String excerpt;

    private String content;

    private String category;

    private String featuredImage;

    private boolean published;

    private Instant createdAt;

    private Instant updatedAt;

    private Instant publishedAt;
}
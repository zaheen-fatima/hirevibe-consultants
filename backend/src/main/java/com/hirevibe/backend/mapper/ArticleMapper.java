package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.article.ArticleResponse;
import com.hirevibe.backend.entity.Article;
import org.springframework.stereotype.Component;

@Component
public class ArticleMapper {

    public ArticleResponse toResponse(
            Article article
    ) {

        return ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .slug(article.getSlug())
                .excerpt(article.getExcerpt())
                .content(article.getContent())
                .category(article.getCategory())
                .featuredImage(article.getFeaturedImage())
                .published(article.isPublished())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .publishedAt(article.getPublishedAt())
                .build();
    }
}
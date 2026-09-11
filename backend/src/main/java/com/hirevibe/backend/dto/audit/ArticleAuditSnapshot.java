package com.hirevibe.backend.dto.audit;

import com.hirevibe.backend.entity.Article;

import java.time.Instant;

public record ArticleAuditSnapshot(
        Long id,
        String title,
        String slug,
        String excerpt,
        String content,
        String category,
        String featuredImage,
        boolean published,
        Instant publishedAt
) {

    public static ArticleAuditSnapshot from(
            Article article
    ) {

        return new ArticleAuditSnapshot(
                article.getId(),
                article.getTitle(),
                article.getSlug(),
                article.getExcerpt(),
                article.getContent(),
                article.getCategory(),
                article.getFeaturedImage(),
                article.isPublished(),
                article.getPublishedAt()
        );
    }
}
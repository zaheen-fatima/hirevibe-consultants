package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.DuplicateResourceException;
import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.article.ArticleResponse;
import com.hirevibe.backend.dto.article.CreateArticleRequest;
import com.hirevibe.backend.dto.article.UpdateArticleRequest;
import com.hirevibe.backend.entity.Article;
import com.hirevibe.backend.mapper.ArticleMapper;
import com.hirevibe.backend.repository.ArticleRepository;
import com.hirevibe.backend.specification.ArticleSpecification;
import com.hirevibe.backend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final ArticleMapper articleMapper;

    @Transactional
    @PreAuthorize("hasAuthority('ARTICLE_CREATE')")
    public ArticleResponse createArticle(
            CreateArticleRequest request
    ) {

        String slug =
                generateUniqueSlug(
                        request.getTitle(),
                        null
                );

        Article article =
                Article.builder()
                        .title(normalize(request.getTitle()))
                        .slug(slug)
                        .excerpt(normalizeNullable(request.getExcerpt()))
                        .content(request.getContent().trim())
                        .category(
                                normalize(request.getCategory())
                        )
                        .featuredImage(
                                normalizeNullable(
                                        request.getFeaturedImage()
                                )
                        )
                        .published(false)
                        .build();

        return articleMapper.toResponse(
                articleRepository.save(article)
        );
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('ARTICLE_READ')")
    public Page<ArticleResponse> getArticles(
            String title,
            String category,
            Boolean published,
            Pageable pageable
    ) {

        Specification<Article> specification =
                Specification.allOf(
                        ArticleSpecification.hasTitle(title),
                        ArticleSpecification.hasCategory(category),
                        ArticleSpecification.isPublished(published)
                );

        return articleRepository
                .findAll(specification, pageable)
                .map(articleMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ArticleResponse> getPublicArticles(
            String category,
            Pageable pageable
    ) {

        Specification<Article> specification =
                Specification.allOf(
                        ArticleSpecification.hasCategory(category),
                        ArticleSpecification.isPublished(true)
                );

        return articleRepository
                .findAll(specification, pageable)
                .map(articleMapper::toResponse);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('ARTICLE_READ')")
    public ArticleResponse getArticle(
            Long id
    ) {

        return articleMapper.toResponse(
                getArticleEntity(id)
        );
    }

    @Transactional(readOnly = true)
    public ArticleResponse getPublicArticleBySlug(
            String slug
    ) {

        Article article =
                articleRepository.findBySlug(
                                slug.trim().toLowerCase(Locale.ROOT)
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Article not found"
                                )
                        );

        if (!article.isPublished()) {
            throw new ResourceNotFoundException(
                    "Article not found"
            );
        }

        return articleMapper.toResponse(article);
    }

    @Transactional
    @PreAuthorize("hasAuthority('ARTICLE_UPDATE')")
    public ArticleResponse updateArticle(
            Long id,
            UpdateArticleRequest request
    ) {

        Article article =
                getArticleEntity(id);

        String newTitle =
                normalize(request.getTitle());

        if (!article.getTitle().equals(newTitle)) {

            article.setSlug(
                    generateUniqueSlug(
                            newTitle,
                            id
                    )
            );
        }

        article.setTitle(newTitle);

        article.setExcerpt(
                normalizeNullable(
                        request.getExcerpt()
                )
        );

        article.setContent(
                request.getContent().trim()
        );

        article.setCategory(
                normalize(request.getCategory())
        );

        article.setFeaturedImage(
                normalizeNullable(
                        request.getFeaturedImage()
                )
        );

        return articleMapper.toResponse(
                articleRepository.save(article)
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('ARTICLE_UPDATE')")
    public ArticleResponse publishArticle(
            Long id
    ) {

        Article article =
                getArticleEntity(id);

        article.setPublished(true);

        if (article.getPublishedAt() == null) {
            article.setPublishedAt(
                    Instant.now()
            );
        }

        return articleMapper.toResponse(
                articleRepository.save(article)
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('ARTICLE_UPDATE')")
    public ArticleResponse unpublishArticle(
            Long id
    ) {

        Article article =
                getArticleEntity(id);

        article.setPublished(false);

        article.setPublishedAt(null);

        return articleMapper.toResponse(
                articleRepository.save(article)
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('ARTICLE_DELETE')")
    public void deleteArticle(
            Long id
    ) {

        Article article =
                getArticleEntity(id);

        articleRepository.delete(article);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('ARTICLE_READ')")
    public Article getArticleEntity(
            Long id
    ) {

        return articleRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Article not found with ID: " + id
                        )
                );
    }

    private String generateUniqueSlug(
            String title,
            Long currentId
    ) {

        String baseSlug =
                SlugUtil.generateSlug(title);

        if (!articleRepository.existsBySlug(baseSlug)) {
            return baseSlug;
        }

        if (currentId != null
                && articleRepository.existsBySlugAndIdNot(
                baseSlug,
                currentId
        ) == false) {

            return baseSlug;
        }

        int counter = 2;

        String candidate;

        do {

            candidate =
                    baseSlug + "-" + counter;

            counter++;

        } while (
                articleRepository.existsBySlug(
                        candidate
                )
        );

        return candidate;
    }

    private String normalize(
            String value
    ) {

        return value.trim();
    }

    private String normalizeNullable(
            String value
    ) {

        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }
}
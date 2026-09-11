package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ArticleRepository
        extends JpaRepository<Article, Long>,
        JpaSpecificationExecutor<Article> {

    Optional<Article> findBySlug(
            String slug
    );

    boolean existsBySlug(
            String slug
    );

    boolean existsBySlugAndIdNot(
            String slug,
            Long id
    );

    long countByPublishedTrue();
}
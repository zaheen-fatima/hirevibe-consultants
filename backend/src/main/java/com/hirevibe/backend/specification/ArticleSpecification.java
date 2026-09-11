package com.hirevibe.backend.specification;

import com.hirevibe.backend.entity.Article;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ArticleSpecification {

    private ArticleSpecification() {
    }

    public static Specification<Article> hasTitle(
            String title
    ) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(title)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(
                            root.get("title")
                    ),
                    "%" +
                            title.trim().toLowerCase() +
                            "%"
            );
        };
    }

    public static Specification<Article> hasCategory(
            String category
    ) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(category)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    criteriaBuilder.lower(
                            root.get("category")
                    ),
                    category.trim().toLowerCase()
            );
        };
    }

    public static Specification<Article> isPublished(
            Boolean published
    ) {

        return (root, query, criteriaBuilder) -> {

            if (published == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("published"),
                    published
            );
        };
    }
}
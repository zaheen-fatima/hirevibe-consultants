package com.hirevibe.backend.specification;

import com.hirevibe.backend.entity.Video;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class VideoSpecification {

    private VideoSpecification() {
    }

    public static Specification<Video> hasTitle(
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

    public static Specification<Video> hasCategory(
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

    public static Specification<Video> isPublished(
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

    public static Specification<Video> isFeatured(
            Boolean featured
    ) {

        return (root, query, criteriaBuilder) -> {

            if (featured == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("featured"),
                    featured
            );
        };
    }
}
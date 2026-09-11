package com.hirevibe.backend.specification;

import com.hirevibe.backend.entity.Job;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class JobSpecification {

    private JobSpecification() {
    }

    public static Specification<Job> hasTitle(String title) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(title)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    "%" + title.trim().toLowerCase() + "%"
            );
        };
    }

    public static Specification<Job> hasLocation(String location) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(location)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("location")),
                    "%" + location.trim().toLowerCase() + "%"
            );
        };
    }

    public static Specification<Job> hasType(String type) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(type)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    criteriaBuilder.lower(root.get("type")),
                    type.trim().toLowerCase()
            );
        };
    }

    public static Specification<Job> hasActive(Boolean active) {

        return (root, query, criteriaBuilder) -> {

            if (active == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("active"),
                    active
            );
        };
    }
}
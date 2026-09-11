package com.hirevibe.backend.specification;

import com.hirevibe.backend.entity.Application;
import com.hirevibe.backend.entity.ApplicationStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ApplicationSpecification {

    private ApplicationSpecification() {
    }

    public static Specification<Application> hasName(String name) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(name)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    "%" + name.trim().toLowerCase() + "%"
            );
        };
    }

    public static Specification<Application> hasEmail(String email) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(email)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")),
                    "%" + email.trim().toLowerCase() + "%"
            );
        };
    }

    public static Specification<Application> hasStatus(
            ApplicationStatus status
    ) {

        return (root, query, criteriaBuilder) -> {

            if (status == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("status"),
                    status
            );
        };
    }

    public static Specification<Application> hasJobId(Long jobId) {

        return (root, query, criteriaBuilder) -> {

            if (jobId == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("job").get("id"),
                    jobId
            );
        };
    }
}
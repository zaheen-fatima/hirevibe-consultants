package com.hirevibe.backend.specification;

import com.hirevibe.backend.entity.Inquiry;
import com.hirevibe.backend.entity.InquiryStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class InquirySpecification {

    private InquirySpecification() {
    }

    public static Specification<Inquiry> hasName(
            String name
    ) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(name)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(
                            root.get("name")
                    ),
                    "%" +
                            name.trim().toLowerCase() +
                            "%"
            );
        };
    }

    public static Specification<Inquiry> hasEmail(
            String email
    ) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(email)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(
                            root.get("email")
                    ),
                    "%" +
                            email.trim().toLowerCase() +
                            "%"
            );
        };
    }

    public static Specification<Inquiry> hasSubject(
            String subject
    ) {

        return (root, query, criteriaBuilder) -> {

            if (!StringUtils.hasText(subject)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(
                            root.get("subject")
                    ),
                    "%" +
                            subject.trim().toLowerCase() +
                            "%"
            );
        };
    }

    public static Specification<Inquiry> hasStatus(
            InquiryStatus status
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
}
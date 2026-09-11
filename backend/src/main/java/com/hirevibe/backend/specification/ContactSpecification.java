package com.hirevibe.backend.specification;

import com.hirevibe.backend.entity.Contact;
import com.hirevibe.backend.entity.ContactStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ContactSpecification {

    private ContactSpecification() {
    }

    public static Specification<Contact> hasName(String name) {
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

    public static Specification<Contact> hasEmail(String email) {
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

    public static Specification<Contact> hasStatus(
            ContactStatus status
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
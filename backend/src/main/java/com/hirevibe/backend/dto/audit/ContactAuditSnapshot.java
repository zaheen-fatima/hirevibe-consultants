package com.hirevibe.backend.dto.audit;

import com.hirevibe.backend.entity.Contact;

import java.time.Instant;

public record ContactAuditSnapshot(
        Long id,
        String name,
        String email,
        String phone,
        String subject,
        String message,
        String status,
        String adminReply,
        Instant repliedAt
) {

    public static ContactAuditSnapshot from(
            Contact contact
    ) {

        return new ContactAuditSnapshot(
                contact.getId(),
                contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getSubject(),
                contact.getMessage(),
                contact.getStatus() != null
                        ? contact.getStatus().name()
                        : null,
                contact.getAdminReply(),
                contact.getRepliedAt()
        );
    }
}
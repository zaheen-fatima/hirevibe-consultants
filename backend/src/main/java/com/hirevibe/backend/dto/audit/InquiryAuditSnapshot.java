package com.hirevibe.backend.dto.audit;

import com.hirevibe.backend.entity.Inquiry;

public record InquiryAuditSnapshot(
        Long id,
        String name,
        String email,
        String phone,
        String company,
        String serviceType,
        String hiringRequirement,
        String location,
        String subject,
        String message,
        String status,
        String adminReply
) {

    public static InquiryAuditSnapshot from(
            Inquiry inquiry
    ) {

        return new InquiryAuditSnapshot(
                inquiry.getId(),
                inquiry.getName(),
                inquiry.getEmail(),
                inquiry.getPhone(),
                inquiry.getCompany(),
                inquiry.getServiceType(),
                inquiry.getHiringRequirement(),
                inquiry.getLocation(),
                inquiry.getSubject(),
                inquiry.getMessage(),
                inquiry.getStatus() != null
                        ? inquiry.getStatus().name()
                        : null,
                inquiry.getAdminReply()
        );
    }
}
package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.inquiry.InquiryResponse;
import com.hirevibe.backend.entity.Inquiry;
import org.springframework.stereotype.Component;

@Component
public class InquiryMapper {

    public InquiryResponse toResponse(
            Inquiry inquiry
    ) {

        return InquiryResponse.builder()
                .id(inquiry.getId())
                .name(inquiry.getName())
                .email(inquiry.getEmail())
                .phone(inquiry.getPhone())
                .company(inquiry.getCompany())
                .serviceType(inquiry.getServiceType())
                .hiringRequirement(inquiry.getHiringRequirement())
                .location(inquiry.getLocation())
                .subject(inquiry.getSubject())
                .message(inquiry.getMessage())
                .status(inquiry.getStatus())
                .adminReply(inquiry.getAdminReply())
                .createdAt(inquiry.getCreatedAt())
                .updatedAt(inquiry.getUpdatedAt())
                .build();
    }
}
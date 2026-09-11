package com.hirevibe.backend.dto.inquiry;

import com.hirevibe.backend.entity.InquiryStatus;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InquiryResponse {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private String company;

    private String serviceType;

    private String hiringRequirement;

    private String location;

    private String subject;

    private String message;

    private InquiryStatus status;

    private String adminReply;

    private Instant createdAt;

    private Instant updatedAt;
}
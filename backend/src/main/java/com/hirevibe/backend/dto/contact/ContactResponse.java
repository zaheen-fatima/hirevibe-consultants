package com.hirevibe.backend.dto.contact;

import com.hirevibe.backend.entity.ContactStatus;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private String subject;

    private String message;

    private ContactStatus status;

    private String adminReply;

    private Instant repliedAt;

    private Instant createdAt;

    private Instant updatedAt;
}
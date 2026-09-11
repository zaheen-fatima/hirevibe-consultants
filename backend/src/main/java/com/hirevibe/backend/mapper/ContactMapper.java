package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.contact.ContactResponse;
import com.hirevibe.backend.entity.Contact;
import org.springframework.stereotype.Component;

@Component
public class ContactMapper {

    public ContactResponse toResponse(Contact contact) {
        return ContactResponse.builder()
                .id(contact.getId())
                .name(contact.getName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .subject(contact.getSubject())
                .message(contact.getMessage())
                .status(contact.getStatus())
                .adminReply(contact.getAdminReply())
                .repliedAt(contact.getRepliedAt())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }
}
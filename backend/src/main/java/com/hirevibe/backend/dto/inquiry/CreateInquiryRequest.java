package com.hirevibe.backend.dto.inquiry;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInquiryRequest {

    @NotBlank(message = "Name is required")
    @Size(
            max = 150,
            message = "Name must not exceed 150 characters"
    )
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(
            max = 255,
            message = "Email must not exceed 255 characters"
    )
    private String email;

    @NotBlank(message = "Phone is required")
    @Size(
            max = 30,
            message = "Phone must not exceed 30 characters"
    )
    private String phone;

    @Size(
            max = 200,
            message = "Company must not exceed 200 characters"
    )
    private String company;

    @NotBlank(message = "Service type is required")
    @Size(
            max = 100,
            message = "Service type must not exceed 100 characters"
    )
    private String serviceType;

    @NotBlank(message = "Hiring requirement is required")
    @Size(
            max = 3000,
            message = "Hiring requirement must not exceed 3000 characters"
    )
    private String hiringRequirement;

    @Size(
            max = 200,
            message = "Location must not exceed 200 characters"
    )
    private String location;

    @NotBlank(message = "Subject is required")
    @Size(
            max = 200,
            message = "Subject must not exceed 200 characters"
    )
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(
            max = 5000,
            message = "Message must not exceed 5000 characters"
    )
    private String message;
}
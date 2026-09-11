package com.hirevibe.backend.dto.inquiry;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplyInquiryRequest {

    @NotBlank(message = "Reply message is required")
    @Size(
            max = 5000,
            message = "Reply must not exceed 5000 characters"
    )
    private String reply;
}
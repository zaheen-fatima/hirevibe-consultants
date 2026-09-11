package com.hirevibe.backend.dto.contact;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplyContactRequest {

    @NotBlank(message = "Reply message is required")
    @Size(max = 10000, message = "Reply must not exceed 10000 characters")
    private String reply;
}
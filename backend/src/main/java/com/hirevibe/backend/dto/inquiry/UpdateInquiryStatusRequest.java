package com.hirevibe.backend.dto.inquiry;

import com.hirevibe.backend.entity.InquiryStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateInquiryStatusRequest {

    @NotNull(message = "Inquiry status is required")
    private InquiryStatus status;
}
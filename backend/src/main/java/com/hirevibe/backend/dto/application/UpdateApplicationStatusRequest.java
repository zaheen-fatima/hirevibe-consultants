package com.hirevibe.backend.dto.application;

import com.hirevibe.backend.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateApplicationStatusRequest {

    @NotNull(message = "Application status is required")
    private ApplicationStatus status;
}
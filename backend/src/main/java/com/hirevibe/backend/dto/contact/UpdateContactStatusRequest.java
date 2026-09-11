package com.hirevibe.backend.dto.contact;

import com.hirevibe.backend.entity.ContactStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateContactStatusRequest {

    @NotNull(message = "Status is required")
    private ContactStatus status;
}
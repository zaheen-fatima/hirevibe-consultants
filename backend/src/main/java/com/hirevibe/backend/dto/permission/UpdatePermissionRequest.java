package com.hirevibe.backend.dto.permission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePermissionRequest {

    @NotBlank(message = "Permission name is required")
    @Size(max = 100, message = "Permission name must not exceed 100 characters")
    private String name;
}
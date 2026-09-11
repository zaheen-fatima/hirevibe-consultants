package com.hirevibe.backend.dto.permission;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolePermissionUpdateRequest {

    @NotNull(message = "Permission IDs are required")
    @Builder.Default
    private Set<Long> permissionIds = Set.of();
}
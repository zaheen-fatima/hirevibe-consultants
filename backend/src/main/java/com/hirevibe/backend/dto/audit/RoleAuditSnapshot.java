package com.hirevibe.backend.dto.audit;

import com.hirevibe.backend.entity.Role;

public record RoleAuditSnapshot(
        Long id,
        String name
) {

    public static RoleAuditSnapshot from(
            Role role
    ) {

        return new RoleAuditSnapshot(
                role.getId(),
                role.getName()
        );
    }
}
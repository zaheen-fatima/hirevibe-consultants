package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.permission.PermissionResponse;
import com.hirevibe.backend.entity.Permission;
import org.springframework.stereotype.Component;

@Component
public class PermissionMapper {

    public PermissionResponse toResponse(Permission permission) {

        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .build();
    }
}
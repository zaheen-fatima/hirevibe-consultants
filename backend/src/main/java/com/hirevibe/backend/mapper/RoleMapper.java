package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.role.RoleResponse;
import com.hirevibe.backend.entity.Permission;
import com.hirevibe.backend.entity.Role;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class RoleMapper {

    public RoleResponse toResponse(Role role) {

        Set<String> permissions =
                role.getPermissions() == null
                        ? Set.of()
                        : role.getPermissions()
                          .stream()
                          .map(Permission::getName)
                          .collect(Collectors.toSet());

        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .permissions(permissions)
                .build();
    }
}
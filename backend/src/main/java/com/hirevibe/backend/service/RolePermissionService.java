package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.permission.PermissionResponse;
import com.hirevibe.backend.dto.permission.RolePermissionUpdateRequest;
import com.hirevibe.backend.entity.Permission;
import com.hirevibe.backend.entity.Role;
import com.hirevibe.backend.mapper.PermissionMapper;
import com.hirevibe.backend.repository.PermissionRepository;
import com.hirevibe.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RolePermissionService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public List<PermissionResponse> getRolePermissions(Long roleId) {

        Role role = findRole(roleId);

        return role.getPermissions()
                .stream()
                .map(permissionMapper::toResponse)
                .toList();
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_UPDATE')")
    public List<PermissionResponse> updateRolePermissions(
            Long roleId,
            RolePermissionUpdateRequest request
    ) {

        Role role = findRole(roleId);

        List<Permission> permissions =
                permissionRepository.findAllById(
                        request.getPermissionIds()
                );

        if (permissions.size() != request.getPermissionIds().size()) {
            throw new ResourceNotFoundException(
                    "One or more permission IDs do not exist"
            );
        }

        role.setPermissions(new HashSet<>(permissions));

        Role updatedRole = roleRepository.save(role);

        return updatedRole.getPermissions()
                .stream()
                .map(permissionMapper::toResponse)
                .toList();
    }

    private Role findRole(Long roleId) {

        return roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found with ID: " + roleId
                        )
                );
    }
}
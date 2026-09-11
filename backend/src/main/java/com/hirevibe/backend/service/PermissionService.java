package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.DuplicateResourceException;
import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.permission.CreatePermissionRequest;
import com.hirevibe.backend.dto.permission.PermissionResponse;
import com.hirevibe.backend.dto.permission.UpdatePermissionRequest;
import com.hirevibe.backend.entity.Permission;
import com.hirevibe.backend.mapper.PermissionMapper;
import com.hirevibe.backend.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    @Transactional
    @PreAuthorize("hasAuthority('PERMISSION_CREATE')")
    public PermissionResponse createPermission(
            CreatePermissionRequest request
    ) {

        String name = normalizePermissionName(request.getName());

        if (permissionRepository.existsByName(name)) {
            throw new DuplicateResourceException(
                    "A permission already exists with name: " + name
            );
        }

        Permission permission = Permission.builder()
                .name(name)
                .build();

        return permissionMapper.toResponse(
                permissionRepository.save(permission)
        );
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    public Page<PermissionResponse> getAllPermissions(
            Pageable pageable
    ) {

        return permissionRepository
                .findAll(pageable)
                .map(permissionMapper::toResponse);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    public PermissionResponse getPermissionById(Long id) {

        return permissionMapper.toResponse(
                findPermission(id)
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('PERMISSION_UPDATE')")
    public PermissionResponse updatePermission(
            Long id,
            UpdatePermissionRequest request
    ) {

        Permission permission = findPermission(id);

        String name = normalizePermissionName(request.getName());

        if (permissionRepository.existsByNameAndIdNot(name, id)) {
            throw new DuplicateResourceException(
                    "A permission already exists with name: " + name
            );
        }

        permission.setName(name);

        return permissionMapper.toResponse(
                permissionRepository.save(permission)
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('PERMISSION_DELETE')")
    public void deletePermission(Long id) {

        Permission permission = findPermission(id);

        permissionRepository.delete(permission);
    }

    private Permission findPermission(Long id) {

        return permissionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Permission not found with ID: " + id
                        )
                );
    }

    private String normalizePermissionName(String name) {

        return name.trim().toUpperCase();
    }
}
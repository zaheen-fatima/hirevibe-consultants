package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.DuplicateResourceException;
import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.audit.RoleAuditSnapshot;
import com.hirevibe.backend.dto.role.CreateRoleRequest;
import com.hirevibe.backend.dto.role.RoleResponse;
import com.hirevibe.backend.dto.role.UpdateRoleRequest;
import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.entity.Role;
import com.hirevibe.backend.mapper.RoleMapper;
import com.hirevibe.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;
    private final AuditLogService auditLogService;

    /**
     * Creates a role.
     */
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_CREATE')")
    public RoleResponse createRole(
            CreateRoleRequest request
    ) {
        String roleName =
                normalizeRoleName(request.getName());

        if (roleRepository.existsByName(roleName)) {

            throw new DuplicateResourceException(
                    "A role already exists with name: "
                            + roleName
            );
        }

        Role role =
                Role.builder()
                        .name(roleName)
                        .build();

        Role savedRole =
                roleRepository.save(role);

        auditLogService.recordCreate(
                AuditAction.CREATE,
                "ROLE",
                savedRole.getId().toString(),
                "Created role #" + savedRole.getId(),
                RoleAuditSnapshot.from(savedRole)
        );

        return roleMapper.toResponse(
                savedRole
        );
    }

    /**
     * Paginated role listing.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public Page<RoleResponse> getAllRoles(
            Pageable pageable
    ) {
        return roleRepository
                .findAll(pageable)
                .map(roleMapper::toResponse);
    }

    /**
     * Retrieves a role.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public RoleResponse getRoleById(Long id) {

        return roleMapper.toResponse(
                findRole(id)
        );
    }

    /**
     * Updates role name.
     */
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_UPDATE')")
    public RoleResponse updateRole(
            Long id,
            UpdateRoleRequest request
    ) {
        Role role =
                findRole(id);

        RoleAuditSnapshot before =
                RoleAuditSnapshot.from(role);

        String roleName =
                normalizeRoleName(request.getName());

        if (roleRepository.existsByNameAndIdNot(
                roleName,
                id
        )) {

            throw new DuplicateResourceException(
                    "A role already exists with name: "
                            + roleName
            );
        }

        role.setName(roleName);

        Role savedRole =
                roleRepository.save(role);

        auditLogService.recordChange(
                AuditAction.UPDATE,
                "ROLE",
                savedRole.getId().toString(),
                "Updated role #" + savedRole.getId(),
                before,
                RoleAuditSnapshot.from(savedRole)
        );

        return roleMapper.toResponse(
                savedRole
        );
    }

    /**
     * Permanently deletes a role.
     */
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_DELETE')")
    public void deleteRole(Long id) {

        Role role =
                findRole(id);

        RoleAuditSnapshot before =
                RoleAuditSnapshot.from(role);

        roleRepository.delete(role);

        auditLogService.recordDelete(
                AuditAction.DELETE,
                "ROLE",
                id.toString(),
                "Deleted role #" + id,
                before
        );
    }

    private Role findRole(Long id) {

        return roleRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Role not found with ID: " + id
                        )
                );
    }

    /**
     * Normalizes all role names into the canonical
     * ROLE_* Spring Security convention.
     */
    private String normalizeRoleName(
            String name
    ) {
        String normalized =
                name
                        .trim()
                        .toUpperCase(Locale.ROOT);

        if (!normalized.startsWith("ROLE_")) {
            normalized =
                    "ROLE_" + normalized;
        }

        return normalized;
    }
}
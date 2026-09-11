package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.permission.PermissionResponse;
import com.hirevibe.backend.dto.permission.RolePermissionUpdateRequest;
import com.hirevibe.backend.service.RolePermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles/{roleId}/permissions")
@RequiredArgsConstructor
@Tag(
        name = "Role Permissions",
        description = "Assignment and management of permissions for application roles"
)
@SecurityRequirement(name = "bearerAuth")
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    @Operation(
            summary = "Get role permissions",
            description = "Returns all permissions currently assigned to a role."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Role permissions retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Role not found"
            )
    })
    @GetMapping
    public ResponseEntity<List<PermissionResponse>> getRolePermissions(
            @PathVariable Long roleId
    ) {
        return ResponseEntity.ok(
                rolePermissionService.getRolePermissions(roleId)
        );
    }

    @Operation(
            summary = "Assign permissions to role",
            description = "Assigns one or more permissions to an existing role."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Permissions assigned successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid permission assignment"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Role or permission not found"
            )
    })
    @PutMapping
    public ResponseEntity<List<PermissionResponse>> updateRolePermissions(
            @PathVariable Long roleId,
            @Valid @RequestBody RolePermissionUpdateRequest request
    ) {
        return ResponseEntity.ok(
                rolePermissionService.updateRolePermissions(
                        roleId,
                        request
                )
        );
    }
}
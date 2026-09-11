package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.role.CreateRoleRequest;
import com.hirevibe.backend.dto.role.RoleResponse;
import com.hirevibe.backend.dto.role.UpdateRoleRequest;
import com.hirevibe.backend.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Tag(
        name = "Roles",
        description = "Role and role-permission management"
)
@SecurityRequirement(name = "bearerAuth")
public class RoleController {

    private final RoleService roleService;

    @Operation(
            summary = "Create role",
            description = "Creates a new application role."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Role created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid role data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "409", description = "Role already exists")
    })
    @PostMapping
    public ResponseEntity<RoleResponse> createRole(
            @Valid @RequestBody CreateRoleRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(roleService.createRole(request));
    }

    @Operation(
            summary = "Get roles",
            description = "Returns a paginated list of application roles."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Roles retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    public ResponseEntity<Page<RoleResponse>> getAllRoles(
            @PageableDefault(
                    size = 10,
                    sort = "name"
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                roleService.getAllRoles(pageable)
        );
    }

    @Operation(
            summary = "Get role by ID",
            description = "Retrieves a role using its unique identifier."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Role retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                roleService.getRoleById(id)
        );
    }

    @Operation(
            summary = "Update role",
            description = "Updates an existing role."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Role updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid role data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest request
    ) {
        return ResponseEntity.ok(
                roleService.updateRole(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Delete role",
            description = "Deletes an application role."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Role deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(
            @PathVariable Long id
    ) {
        roleService.deleteRole(id);

        return ResponseEntity.noContent().build();
    }
}
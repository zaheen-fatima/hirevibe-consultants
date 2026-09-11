package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.permission.CreatePermissionRequest;
import com.hirevibe.backend.dto.permission.PermissionResponse;
import com.hirevibe.backend.dto.permission.UpdatePermissionRequest;
import com.hirevibe.backend.service.PermissionService;
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
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
@Tag(
        name = "Permissions",
        description = "Permission management and authorization configuration"
)
@SecurityRequirement(name = "bearerAuth")
public class PermissionController {

    private final PermissionService permissionService;

    @Operation(
            summary = "Create permission",
            description = "Creates a new application permission."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Permission created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid permission data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "409", description = "Permission already exists")
    })
    @PostMapping
    public ResponseEntity<PermissionResponse> createPermission(
            @Valid @RequestBody CreatePermissionRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(permissionService.createPermission(request));
    }

    @Operation(
            summary = "Get permissions",
            description = "Returns a paginated list of application permissions."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Permissions retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    public ResponseEntity<Page<PermissionResponse>> getAllPermissions(
            @PageableDefault(
                    size = 20,
                    sort = "name"
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                permissionService.getAllPermissions(pageable)
        );
    }

    @Operation(
            summary = "Get permission by ID",
            description = "Retrieves a permission using its unique identifier."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Permission retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Permission not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PermissionResponse> getPermissionById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                permissionService.getPermissionById(id)
        );
    }

    @Operation(
            summary = "Update permission",
            description = "Updates an existing application permission."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Permission updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid permission data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Permission not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PermissionResponse> updatePermission(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePermissionRequest request
    ) {
        return ResponseEntity.ok(
                permissionService.updatePermission(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Delete permission",
            description = "Deletes an application permission."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Permission deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Permission not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(
            @PathVariable Long id
    ) {
        permissionService.deletePermission(id);

        return ResponseEntity.noContent().build();
    }
}
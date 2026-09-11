package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.user.CreateUserRequest;
import com.hirevibe.backend.dto.user.UpdateUserRequest;
import com.hirevibe.backend.dto.user.UserResponse;
import com.hirevibe.backend.service.UserService;
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
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(
        name = "Users",
        description = "User administration and account management"
)
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Create user",
            description = "Creates a new user account with the specified role."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "User created successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid user data"
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
                    responseCode = "409",
                    description = "User already exists"
            )
    })
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(request));
    }

    @Operation(
            summary = "Get users",
            description = "Returns a paginated list of users."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Users retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            )
    })
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @PageableDefault(
                    size = 10,
                    sort = "name"
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                userService.getAllUsers(pageable)
        );
    }

    @Operation(
            summary = "Get user by ID",
            description = "Retrieves a user using its unique identifier."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User retrieved successfully"
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
                    description = "User not found"
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    @Operation(
            summary = "Update user",
            description = "Updates an existing user's account information."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User updated successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid user data"
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
                    description = "User not found"
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(
                userService.updateUser(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Deactivate user",
            description = "Deactivates an existing user account."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "User deactivated successfully"
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
                    description = "User not found"
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id
    ) {
        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Enable user",
            description = "Enables a previously disabled user account."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User enabled successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PatchMapping("/{id}/enable")
    public ResponseEntity<UserResponse> enableUser(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                userService.enableUser(id)
        );
    }

    @Operation(
            summary = "Disable user",
            description = "Disables an existing user account."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User disabled successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PatchMapping("/{id}/disable")
    public ResponseEntity<UserResponse> disableUser(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                userService.disableUser(id)
        );
    }
}
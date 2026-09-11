package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.LoginRequest;
import com.hirevibe.backend.dto.LoginResponse;
import com.hirevibe.backend.dto.auth.RefreshTokenRequest;
import com.hirevibe.backend.dto.auth.RefreshTokenResponse;
import com.hirevibe.backend.security.CustomUserDetails;
import com.hirevibe.backend.service.AuthService;
import com.hirevibe.backend.service.RefreshTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.hirevibe.backend.dto.auth.ChangePasswordRequest;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(
        name = "Authentication",
        description = "Login, token refresh and logout operations"
)
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @Operation(
            summary = "Authenticate user",
            description = "Authenticates a user using email and password and returns an access token and refresh token."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentication successful"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid email or password"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @Operation(
            summary = "Refresh access token",
            description = "Rotates the refresh token and issues a new access token."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Token refreshed successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Refresh token is invalid, expired or revoked"
            )
    })
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        return ResponseEntity.ok(
                refreshTokenService.refresh(
                        request.getRefreshToken()
                )
        );
    }

    @Operation(
            summary = "Logout",
            description = "Revokes the supplied refresh token."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Logout successful"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication or refresh token is invalid"
            )
    })
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        refreshTokenService.revoke(
                request.getRefreshToken()
        );

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Logout from all sessions",
            description = "Revokes all active refresh tokens for the authenticated user."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "All sessions logged out successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            )
    })
    @PostMapping("/logout-all")
    public ResponseEntity<Void> logoutAll(
            Authentication authentication
    ) {
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        refreshTokenService.revokeAllForUser(
                userDetails.getUserId()
        );

        return ResponseEntity.noContent().build();
    }
    @Operation(
            summary = "Change password",
            description = "Changes the authenticated user's password and revokes all refresh-token sessions."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Password changed successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Current password is invalid or new password is invalid"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            )
    })
    @PostMapping("/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        authService.changePassword(
                userDetails.getUserId(),
                request
        );

        return ResponseEntity.noContent().build();
    }
}
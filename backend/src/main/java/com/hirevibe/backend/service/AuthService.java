package com.hirevibe.backend.service;

import com.hirevibe.backend.dto.LoginRequest;
import com.hirevibe.backend.dto.LoginResponse;
import com.hirevibe.backend.entity.Permission;
import com.hirevibe.backend.entity.User;
import com.hirevibe.backend.repository.UserRepository;
import com.hirevibe.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;
import com.hirevibe.backend.common.exception.BusinessException;
import com.hirevibe.backend.dto.auth.ChangePasswordRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public void changePassword(
            Long userId,
            ChangePasswordRequest request
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new IllegalStateException(
                                "Authenticated user not found"
                        )
                );

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {
            throw new BusinessException(
                    "INVALID_CURRENT_PASSWORD",
                    "Current password is incorrect",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {
            throw new BusinessException(
                    "PASSWORD_UNCHANGED",
                    "New password must be different from the current password",
                    HttpStatus.BAD_REQUEST
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        refreshTokenService.revokeAllForUser(userId);
    }
    @Transactional
    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                request.getPassword()
                        )
                );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated user not found"
                        )
                );

        String accessToken =
                jwtService.generateAccessToken(user);

        String refreshToken =
                refreshTokenService.createRefreshToken(user);

        String role =
                user.getRole() != null
                        ? user.getRole().getName()
                        : null;

        Set<String> permissions =
                user.getRole() != null
                        && user.getRole().getPermissions() != null
                        ? user.getRole()
                          .getPermissions()
                          .stream()
                          .map(Permission::getName)
                          .collect(Collectors.toSet())
                        : Set.of();

        /*
         * Authentication has been fully verified and
         * the required tokens have been generated.
         *
         * Store the authenticated principal in the current
         * SecurityContext so downstream components, including
         * the centralized audit interceptor, can identify
         * the authenticated user for this request.
         */
        SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(role)
                .permissions(permissions)
                .build();
    }
}
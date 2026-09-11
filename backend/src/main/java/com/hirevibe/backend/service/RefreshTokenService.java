package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.auth.RefreshTokenResponse;
import com.hirevibe.backend.entity.RefreshToken;
import com.hirevibe.backend.entity.User;
import com.hirevibe.backend.repository.RefreshTokenRepository;
import com.hirevibe.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final SecureRandom SECURE_RANDOM =
            new SecureRandom();

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Value("${security.jwt.refresh-expiration:2592000000}")
    private long refreshTokenExpiration;

    @Transactional
    public String createRefreshToken(User user) {

        byte[] randomBytes = new byte[64];
        SECURE_RANDOM.nextBytes(randomBytes);

        String rawToken =
                Base64.getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(randomBytes);

        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .tokenHash(tokenHash)
                .user(user)
                .expiresAt(
                        Instant.now()
                                .plusMillis(refreshTokenExpiration)
                )
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }


    @Transactional
    public RefreshTokenResponse refresh(
            String rawRefreshToken
    ) {

        String tokenHash =
                hashToken(rawRefreshToken);

        RefreshToken storedToken =
                refreshTokenRepository
                        .findByTokenHashForUpdate(tokenHash)
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Invalid refresh token"
                                )
                        );

        validateRefreshToken(storedToken);

        User user = storedToken.getUser();

        if (!user.isEnabled()) {
            throw new BadCredentialsException(
                    "User account is disabled"
            );
        }

        storedToken.setRevoked(true);

        refreshTokenRepository.save(storedToken);

        String newAccessToken =
                jwtService.generateAccessToken(user);

        String newRefreshToken =
                createRefreshToken(user);

        return RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .refreshToken(newRefreshToken)
                .build();
    }

    @Transactional
    public void revoke(String rawRefreshToken) {

        String tokenHash = hashToken(rawRefreshToken);

        refreshTokenRepository.findByTokenHash(tokenHash)
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                });
    }

    @Transactional
    public int revokeAllForUser(Long userId) {
        return refreshTokenRepository
                .revokeAllActiveTokensByUserId(userId);
    }

    private void validateRefreshToken(RefreshToken token) {

        if (token.isRevoked()) {
            throw new BadCredentialsException(
                    "Refresh token has been revoked"
            );
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {

            token.setRevoked(true);
            refreshTokenRepository.save(token);

            throw new BadCredentialsException(
                    "Refresh token has expired"
            );
        }
    }

    private String hashToken(String token) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            token.getBytes(StandardCharsets.UTF_8)
                    );

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 algorithm is not available",
                    exception
            );
        }
    }
}
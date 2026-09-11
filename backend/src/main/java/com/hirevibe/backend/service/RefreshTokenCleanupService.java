package com.hirevibe.backend.service;

import com.hirevibe.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Scheduled(
            fixedDelayString = "${security.jwt.refresh-cleanup-interval:3600000}"
    )
    @Transactional
    public void cleanup() {

        int deleted =
                refreshTokenRepository
                        .deleteExpiredOrRevokedTokens(
                                Instant.now()
                        );

        if (deleted > 0) {
            log.info(
                    "Refresh-token cleanup removed {} expired/revoked tokens",
                    deleted
            );
        }
    }
}
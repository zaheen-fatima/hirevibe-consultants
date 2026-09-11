package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.RefreshToken;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select refreshToken
            from RefreshToken refreshToken
            where refreshToken.tokenHash = :tokenHash
            """)
    Optional<RefreshToken> findByTokenHashForUpdate(
            @Param("tokenHash") String tokenHash
    );

    Optional<RefreshToken> findByTokenHash(
            String tokenHash
    );

    @Modifying
    @Query("""
            update RefreshToken refreshToken
            set refreshToken.revoked = true
            where refreshToken.user.id = :userId
              and refreshToken.revoked = false
            """)
    int revokeAllActiveTokensByUserId(
            @Param("userId") Long userId
    );

    @Modifying
    @Query("""
            delete from RefreshToken refreshToken
            where refreshToken.revoked = true
               or refreshToken.expiresAt < :now
            """)
    int deleteExpiredOrRevokedTokens(
            @Param("now") Instant now
    );
}
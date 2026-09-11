package com.hirevibe.backend.security;

import com.hirevibe.backend.entity.Permission;
import com.hirevibe.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expiration}")
    private long jwtExpiration;

    public String generateAccessToken(User user) {

        Date issuedAt = new Date();
        Date expiration = new Date(
                issuedAt.getTime() + jwtExpiration
        );

        List<String> permissions =
                user.getRole() != null
                        && user.getRole().getPermissions() != null
                        ? user.getRole()
                          .getPermissions()
                          .stream()
                          .map(Permission::getName)
                          .toList()
                        : List.of();

        String role =
                user.getRole() != null
                        ? user.getRole().getName()
                        : null;

        return Jwts.builder()
                .subject(user.getEmail())
                .issuer("hirevibe-backend")
                .issuedAt(issuedAt)
                .expiration(expiration)
                .claim("userId", user.getId())
                .claim("name", user.getName())
                .claim("email", user.getEmail())
                .claim("role", role)
                .claim("permissions", permissions)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    public boolean isTokenValid(String token) {

        try {
            Claims claims = extractAllClaims(token);

            return claims.getSubject() != null
                    && claims.getExpiration().after(new Date());

        } catch (Exception exception) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .requireIssuer("hirevibe-backend")
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);

        return Keys.hmacShaKeyFor(keyBytes);
    }
}
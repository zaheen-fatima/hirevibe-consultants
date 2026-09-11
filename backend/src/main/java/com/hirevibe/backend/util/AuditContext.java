package com.hirevibe.backend.util;

import com.hirevibe.backend.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@UtilityClass
public class AuditContext {

    public Long currentUserId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return null;
        }

        Object principal =
                authentication.getPrincipal();

        if (principal instanceof CustomUserDetails userDetails) {

            return userDetails.getUserId();
        }

        return null;
    }

    public String currentUserEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return null;
        }

        Object principal =
                authentication.getPrincipal();

        if (principal instanceof CustomUserDetails userDetails) {

            return userDetails.getEmail();
        }

        return null;
    }

    public String ipAddress(
            HttpServletRequest request
    ) {

        String forwarded =
                request.getHeader("X-Forwarded-For");

        if (forwarded != null
                && !forwarded.isBlank()) {

            return forwarded
                    .split(",")[0]
                    .trim();
        }

        return request.getRemoteAddr();
    }

    public String userAgent(
            HttpServletRequest request
    ) {

        return request.getHeader("User-Agent");
    }
}
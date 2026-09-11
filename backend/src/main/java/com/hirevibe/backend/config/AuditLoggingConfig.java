package com.hirevibe.backend.config;

import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.service.AuditLogService;
import com.hirevibe.backend.util.AuditRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Locale;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class AuditLoggingConfig
        implements WebMvcConfigurer {

    private static final Set<String> IGNORED_PATHS =
            Set.of(
                    "/api/v1/health",
                    "/api/v1/audit-logs",
                    "/actuator/health",
                    "/actuator/info"
            );

    private final AuditLogService auditLogService;

    @Override
    public void addInterceptors(
            InterceptorRegistry registry
    ) {

        registry
                .addInterceptor(
                        new AuditLoggingInterceptor(
                                auditLogService
                        )
                )
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/v1/audit-logs/**"
                );
    }

    private static class AuditLoggingInterceptor
            implements HandlerInterceptor {

        private final AuditLogService auditLogService;

        private AuditLoggingInterceptor(
                AuditLogService auditLogService
        ) {
            this.auditLogService =
                    auditLogService;
        }

        @Override
        public void afterCompletion(
                HttpServletRequest request,
                HttpServletResponse response,
                Object handler,
                Exception exception
        ) {

            try {

                String path =
                        request.getRequestURI();

                if (IGNORED_PATHS.contains(path)) {
                    return;
                }

                Boolean detailedAuditRecorded =
                        (Boolean) request.getAttribute(
                                AuditRequestAttributes
                                        .DETAILED_AUDIT_RECORDED
                        );

                if (Boolean.TRUE.equals(
                        detailedAuditRecorded
                )) {
                    return;
                }

                AuditAction action =
                        resolveAction(
                                request.getMethod(),
                                path,
                                response.getStatus()
                        );

                if (action == null) {
                    return;
                }

                String entityType =
                        resolveEntityType(path);

                String entityId =
                        resolveEntityId(path);

                String description =
                        buildDescription(
                                action,
                                entityType,
                                entityId,
                                response.getStatus()
                        );

                String metadata =
                        buildMetadata(
                                request,
                                response
                        );

                auditLogService.record(
                        action,
                        entityType,
                        entityId,
                        description,
                        metadata,
                        request
                );

            } catch (Exception ignored) {

                /*
                 * Audit failure must never break
                 * the business request.
                 */
            }
        }

        private AuditAction resolveAction(
                String method,
                String path,
                int status
        ) {

            String normalizedPath =
                    path.toLowerCase(Locale.ROOT);

            if (normalizedPath.endsWith(
                    "/auth/login"
            )) {

                return status >= 200 && status < 300
                        ? AuditAction.LOGIN
                        : AuditAction.LOGIN_FAILED;
            }

            if (normalizedPath.endsWith(
                    "/auth/logout"
            )
                    || normalizedPath.endsWith(
                    "/auth/logout-all"
            )) {

                return AuditAction.LOGOUT;
            }

            if (normalizedPath.endsWith(
                    "/auth/refresh"
            )) {
                return null;
            }

            if (normalizedPath.endsWith("/resume")
                    && "GET".equalsIgnoreCase(method)) {

                return AuditAction.DOWNLOAD;
            }

            if ("POST".equalsIgnoreCase(method)) {
                return AuditAction.CREATE;
            }

            if ("PUT".equalsIgnoreCase(method)) {
                return AuditAction.UPDATE;
            }

            if ("DELETE".equalsIgnoreCase(method)) {
                return AuditAction.DELETE;
            }

            if ("PATCH".equalsIgnoreCase(method)) {

                if (normalizedPath.endsWith(
                        "/publish"
                )) {
                    return AuditAction.PUBLISH;
                }

                if (normalizedPath.endsWith(
                        "/unpublish"
                )) {
                    return AuditAction.UNPUBLISH;
                }

                if (normalizedPath.endsWith(
                        "/activate"
                )) {
                    return AuditAction.ACTIVATE;
                }

                if (normalizedPath.endsWith(
                        "/deactivate"
                )) {
                    return AuditAction.DEACTIVATE;
                }

                if (normalizedPath.endsWith(
                        "/status"
                )) {
                    return AuditAction.STATUS_CHANGE;
                }

                return AuditAction.UPDATE;
            }

            return null;
        }

        private String resolveEntityType(
                String path
        ) {

            String normalizedPath =
                    path.toLowerCase(Locale.ROOT);

            if (normalizedPath.contains(
                    "/applications"
            )) {
                return "APPLICATION";
            }

            if (normalizedPath.contains(
                    "/inquiries"
            )) {
                return "INQUIRY";
            }

            if (normalizedPath.contains(
                    "/contacts"
            )) {
                return "CONTACT";
            }

            if (normalizedPath.contains(
                    "/articles"
            )) {
                return "ARTICLE";
            }

            if (normalizedPath.contains(
                    "/videos"
            )) {
                return "VIDEO";
            }

            if (normalizedPath.contains(
                    "/jobs"
            )) {
                return "JOB";
            }

            if (normalizedPath.contains(
                    "/users"
            )) {
                return "USER";
            }

            if (normalizedPath.contains(
                    "/roles"
            )) {
                return "ROLE";
            }

            if (normalizedPath.contains(
                    "/permissions"
            )) {
                return "PERMISSION";
            }

            if (normalizedPath.contains(
                    "/auth"
            )) {
                return "AUTH";
            }

            return "SYSTEM";
        }

        private String resolveEntityId(
                String path
        ) {

            String[] segments =
                    path.split("/");

            for (String segment : segments) {

                if (isNumeric(segment)) {
                    return segment;
                }
            }

            return null;
        }

        private boolean isNumeric(
                String value
        ) {

            if (value == null
                    || value.isBlank()) {
                return false;
            }

            for (char character :
                    value.toCharArray()) {

                if (!Character.isDigit(
                        character
                )) {
                    return false;
                }
            }

            return true;
        }

        private String buildDescription(
                AuditAction action,
                String entityType,
                String entityId,
                int status
        ) {

            String target =
                    entityType;

            if (entityId != null) {

                target =
                        target
                                + " #"
                                + entityId;
            }

            return action.name()
                    + " "
                    + target
                    + " (HTTP "
                    + status
                    + ")";
        }

        private String buildMetadata(
                HttpServletRequest request,
                HttpServletResponse response
        ) {

            return """
                    {"method":"%s","path":"%s","status":%d}
                    """.formatted(
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus()
            ).trim();
        }
    }
}
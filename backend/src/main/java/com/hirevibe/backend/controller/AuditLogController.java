package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.audit.AuditLogResponse;
import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@Tag(
        name = "Audit Logs",
        description = "Security and business activity audit history"
)
@SecurityRequirement(name = "bearerAuth")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @Operation(
            summary = "Get audit logs",
            description = "Returns a paginated and filterable audit history."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Audit logs retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogs(
            @RequestParam(required = false)
            AuditAction action,

            @RequestParam(required = false)
            String entityType,

            @RequestParam(required = false)
            String entityId,

            @RequestParam(required = false)
            Long userId,

            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                auditLogService.getAuditLogs(
                        action,
                        entityType,
                        entityId,
                        userId,
                        pageable
                )
        );
    }
}
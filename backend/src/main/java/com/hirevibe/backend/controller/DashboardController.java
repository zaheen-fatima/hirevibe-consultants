package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.dashboard.DashboardResponse;
import com.hirevibe.backend.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(
        name = "Dashboard",
        description = "Administrative dashboard statistics and activity"
)
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(
            summary = "Get admin dashboard",
            description = "Returns administrative KPIs, application status distribution and recent activity."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Dashboard retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "AUDIT_READ permission required"
            )
    })
    @GetMapping
    public ResponseEntity<DashboardResponse>
    getDashboard() {

        return ResponseEntity.ok(
                dashboardService.getDashboard()
        );
    }
}
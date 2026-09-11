package com.hirevibe.backend.common.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(
        name = "Health",
        description = "Application health and availability endpoints"
)
public class HealthController {

    @Operation(
            summary = "Check application health",
            description = "Returns the current availability status of the HireVibe backend."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Application is healthy"
            )
    })
    @GetMapping
    public Map<String, Object> health() {

        return Map.of(
                "status", "UP",
                "service", "hirevibe-backend",
                "timestamp", Instant.now()
        );
    }
}
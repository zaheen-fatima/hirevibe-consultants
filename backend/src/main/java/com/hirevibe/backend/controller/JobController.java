package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.job.CreateJobRequest;
import com.hirevibe.backend.dto.job.JobResponse;
import com.hirevibe.backend.dto.job.UpdateJobRequest;
import com.hirevibe.backend.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Tag(
        name = "Jobs",
        description = "Job creation, management, activation and public job APIs"
)
public class JobController {

    private final JobService jobService;

    @Operation(
            summary = "Create job",
            description = "Creates a new job posting."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Job created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid job data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody CreateJobRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(jobService.createJob(request));
    }

    @Operation(
            summary = "Get all jobs",
            description = "Returns a paginated list of jobs for administrative management."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Jobs retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<Page<JobResponse>> getJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt"
            ) Pageable pageable
    ) {
        return ResponseEntity.ok(
                jobService.getJobs(
                        title,
                        location,
                        type,
                        active,
                        pageable
                )
        );
    }

    @Operation(
            summary = "Get public jobs",
            description = "Returns active jobs available to the public."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Jobs retrieved successfully"
            )
    })
    @GetMapping("/public")
    public ResponseEntity<Page<JobResponse>> getPublicJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt"
            ) Pageable pageable
    ) {
        return ResponseEntity.ok(
                jobService.getPublicJobs(
                        title,
                        location,
                        type,
                        pageable
                )
        );
    }
    @GetMapping("/public/{id}")
    public ResponseEntity<JobResponse> getPublicJobById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                jobService.getPublicJobById(id)
        );
    }

    @Operation(
            summary = "Get job by ID",
            description = "Retrieves a job using its unique identifier."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Job retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Job not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                jobService.getJobById(id)
        );
    }

    @Operation(
            summary = "Update job",
            description = "Updates an existing job posting."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Job updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid job data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Job not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobRequest request
    ) {
        return ResponseEntity.ok(
                jobService.updateJob(id, request)
        );
    }

    @Operation(
            summary = "Activate job",
            description = "Activates an existing job posting."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Job activated successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Job not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/activate")
    public ResponseEntity<JobResponse> activateJob(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                jobService.activateJob(id)
        );
    }

    @Operation(
            summary = "Deactivate job",
            description = "Deactivates an existing job posting."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Job deactivated successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Job not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<JobResponse> deactivateJob(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                jobService.deactivateJob(id)
        );
    }

    @Operation(
            summary = "Delete job",
            description = "Deletes an existing job posting."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Job deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Job not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id
    ) {
        jobService.deleteJob(id);

        return ResponseEntity.noContent().build();
    }
}
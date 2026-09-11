package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.application.ApplicationResponse;
import com.hirevibe.backend.dto.application.CreateApplicationRequest;
import com.hirevibe.backend.dto.application.UpdateApplicationStatusRequest;
import com.hirevibe.backend.entity.Application;
import com.hirevibe.backend.entity.ApplicationStatus;
import com.hirevibe.backend.service.ApplicationService;
import com.hirevibe.backend.service.ApplicationStorageService;
import com.hirevibe.backend.service.storage.StorageFile;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Tag(
        name = "Applications",
        description = "Job application submission and application management"
)
public class ApplicationController {

    private final ApplicationService applicationService;

    private final ApplicationStorageService storageService;

    @Operation(
            summary = "Submit job application",
            description = "Submits a job application with applicant details and resume file."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Application submitted successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid application data or resume file"
            )
    })
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApplicationResponse> createApplication(
            @Valid @ModelAttribute CreateApplicationRequest request,
            @RequestPart("resume") MultipartFile resume
    ) {

        return ResponseEntity.ok(
                applicationService.createApplication(
                        request,
                        resume
                )
        );
    }

    @Operation(
            summary = "Get applications",
            description = "Returns a paginated list of job applications with optional filters."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Applications retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<Page<ApplicationResponse>> getApplications(
            @RequestParam(required = false)
            String name,

            @RequestParam(required = false)
            String email,

            @RequestParam(required = false)
            ApplicationStatus status,

            @RequestParam(required = false)
            Long jobId,

            @PageableDefault(
                    size = 10,
                    sort = "appliedAt"
            )
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                applicationService.getApplications(
                        name,
                        email,
                        status,
                        jobId,
                        pageable
                )
        );
    }

    @Operation(
            summary = "Get application by ID",
            description = "Returns the details of a specific job application."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Application retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Application not found"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplication(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                applicationService.getApplication(id)
        );
    }

    @Operation(
            summary = "Update application status",
            description = "Updates the status of an existing job application."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Application status updated successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid application status"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Application not found"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,

            @Valid
            @RequestBody
            UpdateApplicationStatusRequest request
    ) {

        return ResponseEntity.ok(
                applicationService.updateStatus(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Download application resume",
            description = "Redirects to the secured storage location of the applicant's resume."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "302",
                    description = "Redirect to resume storage URL"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Application or resume not found"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}/resume")
    public ResponseEntity<Void> downloadResume(
            @PathVariable Long id
    ) {

        Application application =
                applicationService.getApplicationEntity(id);

        StorageFile storageFile =
                storageService.getResume(
                        application.getResumePath()
                );

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(
                        URI.create(
                                storageFile.getUrl()
                        )
                )
                .build();
    }

    @Operation(
            summary = "Delete application",
            description = "Deletes an existing job application and performs the associated storage cleanup."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Application deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Application not found"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id
    ) {

        applicationService.deleteApplication(id);

        return ResponseEntity.noContent()
                .build();
    }
}
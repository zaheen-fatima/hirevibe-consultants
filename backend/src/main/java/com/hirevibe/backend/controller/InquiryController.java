package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.inquiry.CreateInquiryRequest;
import com.hirevibe.backend.dto.inquiry.InquiryResponse;
import com.hirevibe.backend.dto.inquiry.ReplyInquiryRequest;
import com.hirevibe.backend.dto.inquiry.UpdateInquiryStatusRequest;
import com.hirevibe.backend.entity.InquiryStatus;
import com.hirevibe.backend.service.InquiryService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inquiries")
@RequiredArgsConstructor
@Tag(
        name = "Inquiries",
        description = "Candidate and customer inquiry management"
)
public class InquiryController {

    private final InquiryService inquiryService;

    @Operation(
            summary = "Submit inquiry",
            description = "Creates a new public inquiry."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inquiry submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid inquiry data")
    })
    @PostMapping
    public ResponseEntity<InquiryResponse> createInquiry(
            @Valid
            @RequestBody
            CreateInquiryRequest request
    ) {
        return ResponseEntity.ok(
                inquiryService.createInquiry(request)
        );
    }

    @Operation(
            summary = "Get inquiries",
            description = "Returns a paginated list of inquiries for administrative management."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inquiries retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<Page<InquiryResponse>> getInquiries(
            @RequestParam(required = false)
            String name,

            @RequestParam(required = false)
            String email,

            @RequestParam(required = false)
            String subject,

            @RequestParam(required = false)
            InquiryStatus status,

            @PageableDefault(
                    size = 10,
                    sort = "createdAt"
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                inquiryService.getInquiries(
                        name,
                        email,
                        subject,
                        status,
                        pageable
                )
        );
    }

    @Operation(
            summary = "Get inquiry by ID",
            description = "Retrieves an inquiry using its unique identifier."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inquiry retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Inquiry not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<InquiryResponse> getInquiry(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                inquiryService.getInquiry(id)
        );
    }

    @Operation(
            summary = "Update inquiry status",
            description = "Changes the status of an inquiry."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inquiry status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Inquiry not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/status")
    public ResponseEntity<InquiryResponse> updateStatus(
            @PathVariable Long id,
            @Valid
            @RequestBody
            UpdateInquiryStatusRequest request
    ) {
        return ResponseEntity.ok(
                inquiryService.updateStatus(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Reply to inquiry",
            description = "Adds an administrative reply to an inquiry."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inquiry reply processed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid reply"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Inquiry not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/reply")
    public ResponseEntity<InquiryResponse> replyToInquiry(
            @PathVariable Long id,
            @Valid
            @RequestBody
            ReplyInquiryRequest request
    ) {
        return ResponseEntity.ok(
                inquiryService.replyToInquiry(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Delete inquiry",
            description = "Deletes an existing inquiry."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Inquiry deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Inquiry not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInquiry(
            @PathVariable Long id
    ) {
        inquiryService.deleteInquiry(id);

        return ResponseEntity.noContent().build();
    }
}
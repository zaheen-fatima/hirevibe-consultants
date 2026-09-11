package com.hirevibe.backend.controller;

import com.hirevibe.backend.dto.contact.ContactResponse;
import com.hirevibe.backend.dto.contact.CreateContactRequest;
import com.hirevibe.backend.dto.contact.ReplyContactRequest;
import com.hirevibe.backend.dto.contact.UpdateContactRequest;
import com.hirevibe.backend.dto.contact.UpdateContactStatusRequest;
import com.hirevibe.backend.entity.ContactStatus;
import com.hirevibe.backend.service.ContactService;
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
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
@Tag(
        name = "Contacts",
        description = "Contact form submission and administrative communication"
)
public class ContactController {

    private final ContactService contactService;

    @Operation(
            summary = "Submit contact request",
            description = "Creates a new public contact inquiry."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contact request submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid contact data")
    })
    @PostMapping
    public ResponseEntity<ContactResponse> createContact(
            @Valid @RequestBody CreateContactRequest request
    ) {
        return ResponseEntity.ok(
                contactService.createContact(request)
        );
    }

    @Operation(
            summary = "Get contacts",
            description = "Returns a paginated list of contact requests."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contacts retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<Page<ContactResponse>> getContacts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) ContactStatus status,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt"
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                contactService.getContacts(
                        name,
                        email,
                        status,
                        pageable
                )
        );
    }

    @Operation(
            summary = "Get contact by ID",
            description = "Retrieves a contact request using its unique identifier."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contact retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Contact not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContact(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                contactService.getContact(id)
        );
    }

    @Operation(
            summary = "Update contact",
            description = "Updates an existing contact request."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contact updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid contact data"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Contact not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody UpdateContactRequest request
    ) {
        return ResponseEntity.ok(
                contactService.updateContact(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Update contact status",
            description = "Changes the status of a contact request."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contact status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Contact not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ContactResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateContactStatusRequest request
    ) {
        return ResponseEntity.ok(
                contactService.updateStatus(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Reply to contact",
            description = "Adds an administrative reply to a contact request."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contact reply processed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid reply"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Contact not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/reply")
    public ResponseEntity<ContactResponse> replyContact(
            @PathVariable Long id,
            @Valid @RequestBody ReplyContactRequest request
    ) {
        return ResponseEntity.ok(
                contactService.replyContact(
                        id,
                        request
                )
        );
    }

    @Operation(
            summary = "Delete contact",
            description = "Deletes an existing contact request."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Contact deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Contact not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(
            @PathVariable Long id
    ) {
        contactService.deleteContact(id);

        return ResponseEntity.noContent().build();
    }
}
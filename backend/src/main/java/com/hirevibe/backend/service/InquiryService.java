package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.audit.InquiryAuditSnapshot;
import com.hirevibe.backend.dto.inquiry.CreateInquiryRequest;
import com.hirevibe.backend.dto.inquiry.InquiryResponse;
import com.hirevibe.backend.dto.inquiry.ReplyInquiryRequest;
import com.hirevibe.backend.dto.inquiry.UpdateInquiryStatusRequest;
import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.entity.Inquiry;
import com.hirevibe.backend.entity.InquiryStatus;
import com.hirevibe.backend.mapper.InquiryMapper;
import com.hirevibe.backend.repository.InquiryRepository;
import com.hirevibe.backend.specification.InquirySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final InquiryMapper inquiryMapper;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    /**
     * Public inquiry submission.
     */
    @Transactional
    public InquiryResponse createInquiry(
            CreateInquiryRequest request
    ) {
        Inquiry inquiry = Inquiry.builder()
                .name(
                        normalize(request.getName())
                )
                .email(
                        normalizeEmail(request.getEmail())
                )
                .phone(
                        normalize(request.getPhone())
                )
                .company(
                        normalizeNullable(request.getCompany())
                )
                .serviceType(
                        normalize(request.getServiceType())
                )
                .hiringRequirement(
                        normalize(request.getHiringRequirement())
                )
                .location(
                        normalizeNullable(request.getLocation())
                )
                .subject(
                        normalize(request.getSubject())
                )
                .message(
                        request.getMessage().trim()
                )
                .status(
                        InquiryStatus.NEW
                )
                .build();

        Inquiry savedInquiry =
                inquiryRepository.save(inquiry);

        auditLogService.recordCreate(
                AuditAction.CREATE,
                "INQUIRY",
                savedInquiry.getId().toString(),
                "Created inquiry #"
                        + savedInquiry.getId(),
                InquiryAuditSnapshot.from(savedInquiry)
        );

        emailService.notifyHrInquiry(
                savedInquiry.getName(),
                savedInquiry.getEmail(),
                savedInquiry.getPhone(),
                savedInquiry.getSubject(),
                savedInquiry.getMessage()
        );

        emailService.sendInquiryReceived(
                savedInquiry.getEmail(),
                savedInquiry.getName(),
                savedInquiry.getSubject()
        );

        return inquiryMapper.toResponse(
                savedInquiry
        );
    }

    /**
     * Paginated and filtered inquiry listing.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('INQUIRY_READ')")
    public Page<InquiryResponse> getInquiries(
            String name,
            String email,
            String subject,
            InquiryStatus status,
            Pageable pageable
    ) {
        Specification<Inquiry> specification =
                Specification.allOf(
                        InquirySpecification.hasName(name),
                        InquirySpecification.hasEmail(email),
                        InquirySpecification.hasSubject(subject),
                        InquirySpecification.hasStatus(status)
                );

        return inquiryRepository
                .findAll(specification, pageable)
                .map(inquiryMapper::toResponse);
    }

    /**
     * Retrieves a single inquiry.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('INQUIRY_READ')")
    public InquiryResponse getInquiry(Long id) {
        return inquiryMapper.toResponse(
                getInquiryEntity(id)
        );
    }

    /**
     * Changes inquiry status.
     */
    @Transactional
    @PreAuthorize("hasAuthority('INQUIRY_UPDATE')")
    public InquiryResponse updateStatus(
            Long id,
            UpdateInquiryStatusRequest request
    ) {
        Inquiry inquiry =
                getInquiryEntity(id);

        InquiryAuditSnapshot before =
                InquiryAuditSnapshot.from(inquiry);

        inquiry.setStatus(request.getStatus());

        Inquiry savedInquiry =
                inquiryRepository.save(inquiry);

        auditLogService.recordChange(
                AuditAction.STATUS_CHANGE,
                "INQUIRY",
                savedInquiry.getId().toString(),
                "Changed inquiry status for #"
                        + savedInquiry.getId(),
                before,
                InquiryAuditSnapshot.from(
                        savedInquiry
                )
        );

        return inquiryMapper.toResponse(
                savedInquiry
        );
    }

    /**
     * Adds an administrative reply.
     */
    @Transactional
    @PreAuthorize("hasAuthority('INQUIRY_UPDATE')")
    public InquiryResponse replyToInquiry(
            Long id,
            ReplyInquiryRequest request
    ) {
        Inquiry inquiry =
                getInquiryEntity(id);

        InquiryAuditSnapshot before =
                InquiryAuditSnapshot.from(inquiry);

        String reply =
                request.getReply().trim();

        inquiry.setAdminReply(reply);
        inquiry.setStatus(InquiryStatus.REPLIED);

        Inquiry savedInquiry =
                inquiryRepository.save(inquiry);

        auditLogService.recordChange(
                AuditAction.STATUS_CHANGE,
                "INQUIRY",
                savedInquiry.getId().toString(),
                "Replied to inquiry #"
                        + savedInquiry.getId(),
                before,
                InquiryAuditSnapshot.from(
                        savedInquiry
                )
        );

        emailService.sendInquiryReply(
                savedInquiry.getEmail(),
                savedInquiry.getName(),
                savedInquiry.getSubject(),
                reply
        );

        return inquiryMapper.toResponse(
                savedInquiry
        );
    }

    /**
     * Permanently deletes an inquiry.
     */
    @Transactional
    @PreAuthorize("hasAuthority('INQUIRY_DELETE')")
    public void deleteInquiry(Long id) {

        Inquiry inquiry =
                getInquiryEntity(id);

        InquiryAuditSnapshot before =
                InquiryAuditSnapshot.from(inquiry);

        inquiryRepository.delete(inquiry);

        auditLogService.recordDelete(
                AuditAction.DELETE,
                "INQUIRY",
                id.toString(),
                "Deleted inquiry #" + id,
                before
        );
    }

    /**
     * Internal entity lookup.
     */
    @Transactional(readOnly = true)
    public Inquiry getInquiryEntity(Long id) {

        return inquiryRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Inquiry not found with ID: " + id
                        )
                );
    }

    private String normalize(String value) {
        return value.trim();
    }
    private String normalizeNullable(String value) {

        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }
    private String normalizeEmail(String value) {
        return value
                .trim()
                .toLowerCase(Locale.ROOT);
    }
}
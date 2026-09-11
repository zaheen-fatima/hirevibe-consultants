package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.application.ApplicationResponse;
import com.hirevibe.backend.dto.application.CreateApplicationRequest;
import com.hirevibe.backend.dto.application.UpdateApplicationStatusRequest;
import com.hirevibe.backend.dto.audit.ApplicationAuditSnapshot;
import com.hirevibe.backend.entity.Application;
import com.hirevibe.backend.entity.ApplicationStatus;
import com.hirevibe.backend.entity.Job;
import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.mapper.ApplicationMapper;
import com.hirevibe.backend.repository.ApplicationRepository;
import com.hirevibe.backend.repository.JobRepository;
import com.hirevibe.backend.service.storage.StorageFile;
import com.hirevibe.backend.specification.ApplicationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ApplicationMapper applicationMapper;
    private final ApplicationStorageService storageService;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    @Transactional
    public ApplicationResponse createApplication(
            CreateApplicationRequest request,
            MultipartFile resume
    ) {

        Job job = jobRepository
                .findById(request.getJobId())
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Job not found with ID: "
                                        + request.getJobId()
                        )
                );

        if (!job.isActive()) {
            throw new IllegalStateException(
                    "Applications are closed for this job"
            );
        }

        StorageFile storedResume =
                storageService.storeResume(resume);

        try {

            Application application =
                    Application.builder()
                            .job(job)
                            .name(normalize(request.getName()))
                            .email(normalizeEmail(request.getEmail()))
                            .phone(normalize(request.getPhone()))
                            .qualification(
                                    normalize(request.getQualification())
                            )
                            .resumePath(
                                    storedResume.getIdentifier()
                            )
                            .status(ApplicationStatus.APPLIED)
                            .build();

            Application savedApplication =
                    applicationRepository.save(application);

            auditLogService.recordCreate(
                    AuditAction.CREATE,
                    "APPLICATION",
                    savedApplication.getId().toString(),
                    "Created application #"
                            + savedApplication.getId(),
                    ApplicationAuditSnapshot.from(
                            savedApplication
                    )
            );

            emailService.notifyHrApplication(
                    savedApplication.getId(),
                    savedApplication.getName(),
                    savedApplication.getEmail(),
                    savedApplication.getPhone(),
                    savedApplication.getQualification(),
                    job.getTitle()
            );

            emailService.sendApplicationReceived(
                    savedApplication.getEmail(),
                    savedApplication.getName(),
                    job.getTitle()
            );

            return applicationMapper.toResponse(
                    savedApplication
            );

        } catch (RuntimeException exception) {

            storageService.deleteResume(
                    storedResume.getIdentifier()
            );

            throw exception;
        }
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('APPLICATION_READ')")
    public Page<ApplicationResponse> getApplications(
            String name,
            String email,
            ApplicationStatus status,
            Long jobId,
            Pageable pageable
    ) {

        Specification<Application> specification =
                Specification.allOf(
                        ApplicationSpecification.hasName(name),
                        ApplicationSpecification.hasEmail(email),
                        ApplicationSpecification.hasStatus(status),
                        ApplicationSpecification.hasJobId(jobId)
                );

        return applicationRepository
                .findAll(specification, pageable)
                .map(applicationMapper::toResponse);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('APPLICATION_READ')")
    public Application getApplicationEntity(Long id) {

        return applicationRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Application not found with ID: "
                                        + id
                        )
                );
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('APPLICATION_READ')")
    public ApplicationResponse getApplication(Long id) {
        return applicationMapper.toResponse(
                getApplicationEntity(id)
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('APPLICATION_UPDATE')")
    public ApplicationResponse updateStatus(
            Long id,
            UpdateApplicationStatusRequest request
    ) {

        Application application =
                getApplicationEntity(id);

        ApplicationAuditSnapshot before =
                ApplicationAuditSnapshot.from(application);

        application.setStatus(request.getStatus());

        Application savedApplication =
                applicationRepository.save(application);

        auditLogService.recordChange(
                AuditAction.STATUS_CHANGE,
                "APPLICATION",
                savedApplication.getId().toString(),
                "Changed application status for #"
                        + savedApplication.getId(),
                before,
                ApplicationAuditSnapshot.from(
                        savedApplication
                )
        );

        return applicationMapper.toResponse(
                savedApplication
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('APPLICATION_DELETE')")
    public void deleteApplication(Long id) {

        Application application =
                getApplicationEntity(id);

        ApplicationAuditSnapshot before =
                ApplicationAuditSnapshot.from(application);

        String storageIdentifier =
                application.getResumePath();

        applicationRepository.delete(application);

        auditLogService.recordDelete(
                AuditAction.DELETE,
                "APPLICATION",
                id.toString(),
                "Deleted application #" + id,
                before
        );

        storageService.deleteResume(
                storageIdentifier
        );
    }

    private String normalize(String value) {
        return value.trim();
    }

    private String normalizeEmail(String value) {
        return value
                .trim()
                .toLowerCase(Locale.ROOT);
    }
}
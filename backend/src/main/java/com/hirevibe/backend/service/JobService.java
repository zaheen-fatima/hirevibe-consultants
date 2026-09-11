package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.audit.JobAuditSnapshot;
import com.hirevibe.backend.dto.job.CreateJobRequest;
import com.hirevibe.backend.dto.job.JobResponse;
import com.hirevibe.backend.dto.job.UpdateJobRequest;
import com.hirevibe.backend.entity.Job;
import com.hirevibe.backend.mapper.JobMapper;
import com.hirevibe.backend.repository.JobRepository;
import com.hirevibe.backend.specification.JobSpecification;
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
public class JobService {

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final AuditLogService auditLogService;

    @Transactional
    @PreAuthorize("hasAuthority('JOB_CREATE')")
    public JobResponse createJob(CreateJobRequest request) {

        Job job = Job.builder()
                .title(normalizeRequired(request.getTitle()))
                .location(normalizeRequired(request.getLocation()))
                .description(request.getDescription().trim())
                .type(normalizeType(request.getType()))
                .active(true)
                .build();

        Job savedJob = jobRepository.save(job);

        auditLogService.recordCreate(
                com.hirevibe.backend.entity.AuditAction.CREATE,
                "JOB",
                savedJob.getId().toString(),
                "Created job #" + savedJob.getId(),
                JobAuditSnapshot.from(savedJob)
        );

        return jobMapper.toResponse(savedJob);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('JOB_READ')")
    public Page<JobResponse> getJobs(
            String title,
            String location,
            String type,
            Boolean active,
            Pageable pageable
    ) {

        Specification<Job> specification =
                Specification.allOf(
                        JobSpecification.hasTitle(title),
                        JobSpecification.hasLocation(location),
                        JobSpecification.hasType(type),
                        JobSpecification.hasActive(active)
                );

        return jobRepository
                .findAll(specification, pageable)
                .map(jobMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> getPublicJobs(
            String title,
            String location,
            String type,
            Pageable pageable
    ) {

        Specification<Job> specification =
                Specification.allOf(
                        JobSpecification.hasTitle(title),
                        JobSpecification.hasLocation(location),
                        JobSpecification.hasType(type),
                        JobSpecification.hasActive(true)
                );

        return jobRepository
                .findAll(specification, pageable)
                .map(jobMapper::toResponse);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('JOB_READ')")
    public JobResponse getJobById(Long id) {
        return jobMapper.toResponse(findJob(id));
    }

    @Transactional
    @PreAuthorize("hasAuthority('JOB_UPDATE')")
    public JobResponse updateJob(
            Long id,
            UpdateJobRequest request
    ) {

        Job job = findJob(id);

        JobAuditSnapshot before =
                JobAuditSnapshot.from(job);

        if (request.getTitle() != null
                && !request.getTitle().isBlank()) {

            job.setTitle(
                    normalizeRequired(request.getTitle())
            );
        }

        if (request.getLocation() != null
                && !request.getLocation().isBlank()) {

            job.setLocation(
                    normalizeRequired(request.getLocation())
            );
        }

        if (request.getDescription() != null
                && !request.getDescription().isBlank()) {

            job.setDescription(
                    request.getDescription().trim()
            );
        }

        if (request.getType() != null
                && !request.getType().isBlank()) {

            job.setType(
                    normalizeType(request.getType())
            );
        }

        if (request.getActive() != null) {
            job.setActive(request.getActive());
        }

        Job savedJob = jobRepository.save(job);

        auditLogService.recordChange(
                com.hirevibe.backend.entity.AuditAction.UPDATE,
                "JOB",
                savedJob.getId().toString(),
                "Updated job #" + savedJob.getId(),
                before,
                JobAuditSnapshot.from(savedJob)
        );

        return jobMapper.toResponse(savedJob);
    }

    @Transactional
    @PreAuthorize("hasAuthority('JOB_DELETE')")
    public void deleteJob(Long id) {

        Job job = findJob(id);

        JobAuditSnapshot before =
                JobAuditSnapshot.from(job);

        job.setActive(false);

        Job savedJob = jobRepository.save(job);

        auditLogService.recordChange(
                com.hirevibe.backend.entity.AuditAction.DEACTIVATE,
                "JOB",
                savedJob.getId().toString(),
                "Deactivated job #" + savedJob.getId(),
                before,
                JobAuditSnapshot.from(savedJob)
        );
    }

    @Transactional
    @PreAuthorize("hasAuthority('JOB_UPDATE')")
    public JobResponse activateJob(Long id) {

        Job job = findJob(id);

        JobAuditSnapshot before =
                JobAuditSnapshot.from(job);

        job.setActive(true);

        Job savedJob = jobRepository.save(job);

        auditLogService.recordChange(
                com.hirevibe.backend.entity.AuditAction.ACTIVATE,
                "JOB",
                savedJob.getId().toString(),
                "Activated job #" + savedJob.getId(),
                before,
                JobAuditSnapshot.from(savedJob)
        );

        return jobMapper.toResponse(savedJob);
    }

    @Transactional
    @PreAuthorize("hasAuthority('JOB_UPDATE')")
    public JobResponse deactivateJob(Long id) {

        Job job = findJob(id);

        JobAuditSnapshot before =
                JobAuditSnapshot.from(job);

        job.setActive(false);

        Job savedJob = jobRepository.save(job);

        auditLogService.recordChange(
                com.hirevibe.backend.entity.AuditAction.DEACTIVATE,
                "JOB",
                savedJob.getId().toString(),
                "Deactivated job #" + savedJob.getId(),
                before,
                JobAuditSnapshot.from(savedJob)
        );

        return jobMapper.toResponse(savedJob);
    }

    private Job findJob(Long id) {

        return jobRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Job not found with ID: " + id
                        )
                );
    }

    private String normalizeRequired(String value) {
        return value.trim();
    }

    private String normalizeType(String type) {
        return type.trim().toUpperCase(Locale.ROOT);
    }
}
package com.hirevibe.backend.service;

import com.hirevibe.backend.dto.audit.AuditLogResponse;
import com.hirevibe.backend.dto.dashboard.DashboardResponse;
import com.hirevibe.backend.entity.ApplicationStatus;
import com.hirevibe.backend.mapper.AuditLogMapper;
import com.hirevibe.backend.repository.ApplicationRepository;
import com.hirevibe.backend.repository.ArticleRepository;
import com.hirevibe.backend.repository.AuditLogRepository;
import com.hirevibe.backend.repository.ContactRepository;
import com.hirevibe.backend.repository.InquiryRepository;
import com.hirevibe.backend.repository.JobRepository;
import com.hirevibe.backend.repository.UserRepository;
import com.hirevibe.backend.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JobRepository jobRepository;

    private final ApplicationRepository
            applicationRepository;

    private final InquiryRepository
            inquiryRepository;

    private final ContactRepository
            contactRepository;

    private final ArticleRepository
            articleRepository;

    private final VideoRepository
            videoRepository;

    private final UserRepository userRepository;

    private final AuditLogRepository
            auditLogRepository;

    private final AuditLogMapper auditLogMapper;

    @Transactional(readOnly = true)
    @PreAuthorize(
            "hasAuthority('AUDIT_READ')"
    )
    public DashboardResponse getDashboard() {

        Map<ApplicationStatus, Long>
                applicationStatuses =
                new LinkedHashMap<>();

        Arrays.stream(
                ApplicationStatus.values()
        ).forEach(
                status ->
                        applicationStatuses.put(
                                status,
                                applicationRepository
                                        .countByStatus(
                                                status
                                                )
                                )
        );

        List<AuditLogResponse>
                recentActivity =
                auditLogRepository
                        .findAll(
                                PageRequest.of(
                                        0,
                                        8,
                                        Sort.by(
                                                Sort.Direction.DESC,
                                                "createdAt"
                                                )
                                        )
                                )
                        .stream()
                        .map(
                                auditLogMapper::toResponse
                        )
                        .toList();

        return DashboardResponse
                .builder()
                .totalJobs(
                        jobRepository.count()
                )
                .activeJobs(
                        jobRepository
                                .countByActiveTrue()
                )
                .totalApplications(
                        applicationRepository
                                .count()
                )
                .totalInquiries(
                        inquiryRepository
                                .count()
                )
                .totalContacts(
                        contactRepository
                                .count()
                )
                .totalArticles(
                        articleRepository
                                .count()
                )
                .publishedArticles(
                        articleRepository
                                .countByPublishedTrue()
                )
                .totalVideos(
                        videoRepository
                                .count()
                )
                .publishedVideos(
                        videoRepository
                                .countByPublishedTrue()
                )
                .totalUsers(
                        userRepository
                                .count()
                )
                .applicationStatuses(
                        applicationStatuses
                )
                .recentActivity(
                        recentActivity
                )
                .build();
    }
}
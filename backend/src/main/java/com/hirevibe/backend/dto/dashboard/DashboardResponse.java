package com.hirevibe.backend.dto.dashboard;

import com.hirevibe.backend.dto.audit.AuditLogResponse;
import com.hirevibe.backend.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private long totalJobs;

    private long activeJobs;

    private long totalApplications;

    private long totalInquiries;

    private long totalContacts;

    private long totalArticles;

    private long publishedArticles;

    private long totalVideos;

    private long publishedVideos;

    private long totalUsers;

    private Map<ApplicationStatus, Long>
            applicationStatuses;

    private List<AuditLogResponse>
            recentActivity;
}
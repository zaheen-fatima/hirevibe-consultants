package com.hirevibe.backend.dto.audit;

import com.hirevibe.backend.entity.Job;

public record JobAuditSnapshot(
        Long id,
        String title,
        String location,
        String description,
        String type,
        boolean active
) {

    public static JobAuditSnapshot from(Job job) {
        return new JobAuditSnapshot(
                job.getId(),
                job.getTitle(),
                job.getLocation(),
                job.getDescription(),
                job.getType(),
                job.isActive()
        );
    }
}
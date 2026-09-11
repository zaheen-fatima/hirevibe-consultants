package com.hirevibe.backend.dto.audit;

import com.hirevibe.backend.entity.Application;

public record ApplicationAuditSnapshot(
        Long id,
        Long jobId,
        String name,
        String email,
        String phone,
        String qualification,
        String status
) {

    public static ApplicationAuditSnapshot from(
            Application application
    ) {

        return new ApplicationAuditSnapshot(
                application.getId(),
                application.getJob() != null
                        ? application.getJob().getId()
                        : null,
                application.getName(),
                application.getEmail(),
                application.getPhone(),
                application.getQualification(),
                application.getStatus() != null
                        ? application.getStatus().name()
                        : null
        );
    }
}
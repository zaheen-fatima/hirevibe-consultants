package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.application.ApplicationResponse;
import com.hirevibe.backend.entity.Application;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    public ApplicationResponse toResponse(Application application) {

        return ApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .jobLocation(application.getJob().getLocation())
                .name(application.getName())
                .email(application.getEmail())
                .phone(application.getPhone())
                .qualification(application.getQualification())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .resumeAvailable(application.getResumePath() != null)
                .build();
    }
}
package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.job.JobResponse;
import com.hirevibe.backend.entity.Job;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {

    public JobResponse toResponse(Job job) {

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .location(job.getLocation())
                .description(job.getDescription())
                .type(job.getType())
                .active(job.isActive())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
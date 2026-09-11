package com.hirevibe.backend.dto.application;

import com.hirevibe.backend.entity.ApplicationStatus;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private Long id;

    private Long jobId;

    private String jobTitle;

    private String jobLocation;

    private String name;

    private String email;

    private String phone;

    private String qualification;

    private ApplicationStatus status;

    private Instant appliedAt;

    private Instant updatedAt;

    private boolean resumeAvailable;
}
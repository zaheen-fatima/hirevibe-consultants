package com.hirevibe.backend.dto.job;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobRequest {

    @Size(max = 150, message = "Job title must not exceed 150 characters")
    private String title;

    @Size(max = 150, message = "Job location must not exceed 150 characters")
    private String location;

    private String description;

    @Size(max = 50, message = "Job type must not exceed 50 characters")
    private String type;

    private Boolean active;
}
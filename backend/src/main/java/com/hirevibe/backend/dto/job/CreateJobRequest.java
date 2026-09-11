package com.hirevibe.backend.dto.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 150, message = "Job title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Job location is required")
    @Size(max = 150, message = "Job location must not exceed 150 characters")
    private String location;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotBlank(message = "Job type is required")
    @Size(max = 50, message = "Job type must not exceed 50 characters")
    private String type;
}
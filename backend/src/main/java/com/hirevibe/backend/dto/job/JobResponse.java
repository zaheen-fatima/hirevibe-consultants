package com.hirevibe.backend.dto.job;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {

    private Long id;

    private String title;

    private String location;

    private String description;

    private String type;

    private boolean active;

    private Instant createdAt;

    private Instant updatedAt;
}
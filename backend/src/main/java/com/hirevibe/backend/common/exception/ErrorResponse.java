package com.hirevibe.backend.common.exception;


import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.Map;

@Getter
@Builder
public class ErrorResponse {

    private final boolean success;
    private final String code;
    private final String message;
    private final String path;
    private final Instant timestamp;
    private final Map<String, String> validationErrors;
}
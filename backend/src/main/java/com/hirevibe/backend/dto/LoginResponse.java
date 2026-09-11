package com.hirevibe.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private String refreshToken;

    private Long userId;

    private String name;

    private String email;

    private String role;

    @Builder.Default
    private Set<String> permissions = Set.of();
}
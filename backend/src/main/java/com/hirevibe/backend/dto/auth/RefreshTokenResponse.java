package com.hirevibe.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenResponse {

    private String accessToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private String refreshToken;
}
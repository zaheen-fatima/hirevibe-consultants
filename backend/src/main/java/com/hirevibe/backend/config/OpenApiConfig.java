package com.hirevibe.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "HireVibe Backend API",
                version = "1.0.0",
                description =
                        "Enterprise recruitment and consultancy platform API. " +
                                "Provides authentication, user management, role and permission management, " +
                                "jobs, applications, inquiries, contacts, articles, videos, audit logging " +
                                "and related platform services.",
                contact = @Contact(
                        name = "HireVibe"
                )
        )
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
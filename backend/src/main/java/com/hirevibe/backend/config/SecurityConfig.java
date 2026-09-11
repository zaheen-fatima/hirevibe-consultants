package com.hirevibe.backend.config;

import com.hirevibe.backend.security.CustomUserDetailsService;
import com.hirevibe.backend.security.JwtAuthenticationFilter;
import com.hirevibe.backend.security.RestAccessDeniedHandler;
import com.hirevibe.backend.security.RestAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RestAuthenticationEntryPoint authenticationEntryPoint;
    private final RestAccessDeniedHandler accessDeniedHandler;

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                /*
                 * CORS is handled by CorsConfig.
                 */
                .cors(cors -> {})

                /*
                 * This is a stateless JWT API.
                 * CSRF protection is therefore not used for
                 * Authorization-header based authentication.
                 */
                .csrf(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                org.springframework.security.config.http.SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(
                                authenticationEntryPoint
                        )
                        .accessDeniedHandler(
                                accessDeniedHandler
                        )
                )

                /*
                 * Baseline security headers.
                 *
                 * HSTS is additionally enabled in production
                 * through application-prod.yml.
                 */
                .headers(headers -> headers

                        .frameOptions(frame ->
                                frame.deny()
                        )

                        .contentTypeOptions(
                                contentTypeOptions -> {}
                        )

                        .referrerPolicy(referrer ->
                                referrer.policy(
                                        org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy
                                                .STRICT_ORIGIN_WHEN_CROSS_ORIGIN
                                )
                        )

                        .permissionsPolicyHeader(permissions ->
                                permissions.policy(
                                        "camera=(), microphone=(), geolocation=()"
                                )
                        )

                        .httpStrictTransportSecurity(hsts -> {
                            if ("prod".equalsIgnoreCase(
                                    System.getProperty(
                                            "spring.profiles.active",
                                            ""
                                    )
                            )) {
                                hsts
                                        .includeSubDomains(true)
                                        .maxAgeInSeconds(31536000);
                            }
                        })
                )

                .authorizeHttpRequests(auth -> auth

                        /*
                         * -------------------------------------------------
                         * Public infrastructure
                         * -------------------------------------------------
                         */

                        .requestMatchers(
                                "/api/v1/health"
                        ).permitAll()

                        /*
                         * Health/info are intentionally public so that
                         * hosting/load-balancing infrastructure can verify
                         * service availability.
                         */
                        .requestMatchers(
                                "/actuator/health",
                                "/actuator/info"
                        ).permitAll()

                        /*
                         * Swagger/OpenAPI is enabled only by the local
                         * profile. Production configuration disables it.
                         */
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs",
                                "/v3/api-docs/**"
                        ).permitAll()
                        /*
                         * Public reviews
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/reviews"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/reviews/public",
                                "/api/v1/reviews/public/**"
                        ).permitAll()

                        /*
                         * Any other actuator endpoint requires admin
                         * authorization.
                         */
                        .requestMatchers(
                                "/actuator/**"
                        ).hasAuthority("ROLE_ADMIN")

                        /*
                         * -------------------------------------------------
                         * Authentication
                         * -------------------------------------------------
                         */

                        .requestMatchers(
                                "/api/v1/auth/login",
                                "/api/v1/auth/refresh",
                                "/api/v1/auth/logout"
                        ).permitAll()

                        /*
                         * logout-all remains authenticated because it
                         * revokes every refresh token belonging to the
                         * current user.
                         */

                        /*
                         * -------------------------------------------------
                         * Public jobs
                         * -------------------------------------------------
                         */

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/jobs/public"
                        ).permitAll()

                        /*
                         * -------------------------------------------------
                         * Public articles
                         * -------------------------------------------------
                         */

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/articles/public",
                                "/api/v1/articles/public/**"
                        ).permitAll()

                        /*
                         * -------------------------------------------------
                         * Public videos
                         * -------------------------------------------------
                         */

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/videos/public",
                                "/api/v1/videos/public/**"
                        ).permitAll()

                        /*
                         * -------------------------------------------------
                         * Public application submission
                         * -------------------------------------------------
                         */

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/applications"
                        ).permitAll()

                        /*
                         * -------------------------------------------------
                         * Public inquiry submission
                         * -------------------------------------------------
                         */

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/inquiries"
                        ).permitAll()

                        /*
                         * -------------------------------------------------
                         * Public contact submission
                         * -------------------------------------------------
                         */

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/contacts"
                        ).permitAll()


                        /*
                         * Everything else requires authentication.
                         *
                         * Fine-grained authorization continues to be
                         * handled through @PreAuthorize and existing
                         * permission architecture.
                         */
                        .anyRequest()
                        .authenticated()
                )

                .authenticationProvider(
                        authenticationProvider()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
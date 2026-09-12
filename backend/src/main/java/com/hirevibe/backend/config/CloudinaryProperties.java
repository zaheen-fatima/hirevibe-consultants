package com.hirevibe.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.cloudinary")
public class CloudinaryProperties {

    private String cloudName;

    private String apiKey;

    private String apiSecret;

    private String rootFolder;

    private String resumeFolder;

    private String articleImageFolder;

    private String videoThumbnailFolder;
    private String videoFolder;

    private String generalFolder;

    private long signedUrlExpirationSeconds = 900;}
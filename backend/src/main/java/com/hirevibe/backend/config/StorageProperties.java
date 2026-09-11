package com.hirevibe.backend.config;

import com.hirevibe.backend.service.storage.StorageProvider;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {

    private StorageProvider provider;

    private String localDirectory;

    private long maxFileSize;

    private String[] allowedResumeExtensions;
}
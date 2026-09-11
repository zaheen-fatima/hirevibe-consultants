package com.hirevibe.backend.service.storage;

import com.hirevibe.backend.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StorageServiceFactory {

    private final StorageProperties properties;

    private final CloudinaryStorageService cloudinaryStorageService;

    private final LocalStorageService localStorageService;

    public StorageService getStorageService() {

        return switch (properties.getProvider()) {

            case CLOUDINARY ->
                    cloudinaryStorageService;

            case LOCAL ->
                    localStorageService;
        };
    }
}
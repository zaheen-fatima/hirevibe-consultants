package com.hirevibe.backend.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    StorageFile store(
            MultipartFile file,
            StorageCategory category
    );

    StorageFile get(
            String identifier,
            StorageCategory category
    );

    void delete(
            String identifier,
            StorageCategory category
    );
}
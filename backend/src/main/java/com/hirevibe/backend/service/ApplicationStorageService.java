package com.hirevibe.backend.service;

import com.hirevibe.backend.service.storage.StorageCategory;
import com.hirevibe.backend.service.storage.StorageFile;
import com.hirevibe.backend.service.storage.StorageService;
import com.hirevibe.backend.service.storage.StorageServiceFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ApplicationStorageService {

    private final StorageServiceFactory storageServiceFactory;

    public StorageFile storeResume(
            MultipartFile file
    ) {

        return storageService()
                .store(
                        file,
                        StorageCategory.RESUMES
                );
    }

    public StorageFile getResume(
            String identifier
    ) {

        return storageService()
                .get(
                        identifier,
                        StorageCategory.RESUMES
                );
    }

    public void deleteResume(
            String identifier
    ) {

        storageService()
                .delete(
                        identifier,
                        StorageCategory.RESUMES
                );
    }

    private StorageService storageService() {

        return storageServiceFactory
                .getStorageService();
    }
}
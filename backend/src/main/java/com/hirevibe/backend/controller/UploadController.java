package com.hirevibe.backend.controller;

import com.hirevibe.backend.service.storage.StorageCategory;
import com.hirevibe.backend.service.storage.StorageFile;
import com.hirevibe.backend.service.storage.StorageServiceFactory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
@Tag(
        name = "Uploads",
        description = "Authenticated media upload APIs for admin content"
)
public class UploadController {

    private final StorageServiceFactory storageServiceFactory;

    @Operation(
            summary = "Upload article image",
            description = "Uploads an article featured image and returns its delivery URL."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('ARTICLE_CREATE') or hasAuthority('ARTICLE_UPDATE')")
    @PostMapping(
            value = "/article-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<StorageFile> uploadArticleImage(
            @RequestPart("file") MultipartFile file
    ) {
        return ResponseEntity.ok(
                storageServiceFactory
                        .getStorageService()
                        .store(file, StorageCategory.ARTICLE_IMAGES)
        );
    }

    @Operation(
            summary = "Upload video",
            description = "Uploads a video file and returns its delivery URL."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIDEO_CREATE') or hasAuthority('VIDEO_UPDATE')")
    @PostMapping(
            value = "/video",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<StorageFile> uploadVideo(
            @RequestPart("file") MultipartFile file
    ) {
        return ResponseEntity.ok(
                storageServiceFactory
                        .getStorageService()
                        .store(file, StorageCategory.VIDEO_FILES)
        );
    }

    @Operation(
            summary = "Upload video thumbnail",
            description = "Uploads a video thumbnail and returns its delivery URL."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIDEO_CREATE') or hasAuthority('VIDEO_UPDATE')")
    @PostMapping(
            value = "/video-thumbnail",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<StorageFile> uploadVideoThumbnail(
            @RequestPart("file") MultipartFile file
    ) {
        return ResponseEntity.ok(
                storageServiceFactory
                        .getStorageService()
                        .store(file, StorageCategory.VIDEO_THUMBNAILS)
        );
    }
}
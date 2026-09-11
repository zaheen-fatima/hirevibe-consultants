package com.hirevibe.backend.service.storage;

import com.hirevibe.backend.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocalStorageService
        implements StorageService {

    private final StorageProperties properties;

    private final FileValidationService fileValidationService;

    @Override
    public StorageFile store(
            MultipartFile file,
            StorageCategory category
    ) {

        fileValidationService.validate(
                file,
                category
        );

        String extension =
                StringUtils.getFilenameExtension(
                        file.getOriginalFilename()
                );

        String filename =
                UUID.randomUUID() +
                        (StringUtils.hasText(extension)
                                ? "." + extension
                                : "");

        Path categoryDirectory =
                Path.of(
                        properties.getLocalDirectory(),
                        category.name().toLowerCase()
                );

        try {

            Files.createDirectories(
                    categoryDirectory
            );

            Path target =
                    categoryDirectory.resolve(filename)
                            .normalize();

            if (!target.startsWith(
                    categoryDirectory.normalize()
            )) {
                throw new IllegalArgumentException(
                        "Invalid storage path"
                );
            }

            try (InputStream inputStream =
                         file.getInputStream()) {

                Files.copy(
                        inputStream,
                        target,
                        StandardCopyOption.REPLACE_EXISTING
                );
            }

            return StorageFile.builder()
                    .identifier(
                            category.name()
                                    .toLowerCase()
                                    + "/"
                                    + filename
                    )
                    .url(
                            target.toUri().toString()
                    )
                    .resourceType(
                            resolveResourceType(category)
                    )
                    .format(extension)
                    .size(file.getSize())
                    .build();

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Unable to store file locally",
                    exception
            );
        }
    }

    @Override
    public StorageFile get(
            String identifier,
            StorageCategory category
    ) {

        if (!StringUtils.hasText(identifier)) {
            throw new IllegalArgumentException(
                    "Storage identifier is required"
            );
        }

        Path baseDirectory =
                Path.of(
                        properties.getLocalDirectory()
                ).toAbsolutePath().normalize();

        Path target =
                baseDirectory.resolve(identifier)
                        .normalize();

        if (!target.startsWith(baseDirectory)) {
            throw new IllegalArgumentException(
                    "Invalid storage path"
            );
        }

        if (!Files.exists(target)
                || !Files.isRegularFile(target)) {

            throw new IllegalArgumentException(
                    "Stored file not found"
            );
        }

        String extension =
                StringUtils.getFilenameExtension(
                        target.getFileName().toString()
                );

        return StorageFile.builder()
                .identifier(identifier)
                .url(target.toUri().toString())
                .resourceType(
                        resolveResourceType(category)
                )
                .format(extension)
                .build();
    }

    @Override
    public void delete(
            String identifier,
            StorageCategory category
    ) {

        if (!StringUtils.hasText(identifier)) {
            return;
        }

        Path baseDirectory =
                Path.of(
                        properties.getLocalDirectory()
                ).toAbsolutePath().normalize();

        Path target =
                baseDirectory.resolve(identifier)
                        .normalize();

        if (!target.startsWith(baseDirectory)) {
            throw new IllegalArgumentException(
                    "Invalid storage path"
            );
        }

        try {

            Files.deleteIfExists(target);

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Unable to delete local file",
                    exception
            );
        }
    }

    private StorageResourceType resolveResourceType(
            StorageCategory category
    ) {

        return switch (category) {

            case RESUMES, GENERAL ->
                    StorageResourceType.RAW;

            case ARTICLE_IMAGES, VIDEO_THUMBNAILS ->
                    StorageResourceType.IMAGE;
        };
    }
}
package com.hirevibe.backend.service.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hirevibe.backend.config.CloudinaryProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryStorageService
        implements StorageService {

    private static final String DELIVERY_TYPE_UPLOAD =
            "upload";

    private static final String DELIVERY_TYPE_AUTHENTICATED =
            "authenticated";

    private final Cloudinary cloudinary;

    private final CloudinaryProperties properties;

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

        StorageResourceType resourceType =
                resolveResourceType(category);

        String publicId =
                buildPublicId(category);

        String deliveryType =
                resolveDeliveryType(category);

        String format =
                StringUtils.getFilenameExtension(
                        file.getOriginalFilename()
                );

        try {

            Map<?, ?> result =
                    cloudinary.uploader().upload(
                            file.getBytes(),
                            ObjectUtils.asMap(
                                    "public_id",
                                    publicId,

                                    "resource_type",
                                    resourceType.value(),

                                    "type",
                                    deliveryType,

                                    "overwrite",
                                    false,

                                    "unique_filename",
                                    false,

                                    "use_filename",
                                    false
                            )
                    );

            String identifier =
                    String.valueOf(
                            result.get("public_id")
                    );

            String url =
                    buildDeliveryUrl(
                            identifier,
                            resourceType,
                            deliveryType,
                            format
                    );

            return StorageFile.builder()
                    .identifier(identifier)
                    .url(url)
                    .resourceType(resourceType)
                    .format(format)
                    .size(file.getSize())
                    .build();

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Unable to upload file to Cloudinary",
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

        StorageResourceType resourceType =
                resolveResourceType(category);

        String deliveryType =
                resolveDeliveryType(category);

        String url =
                buildDeliveryUrl(
                        identifier,
                        resourceType,
                        deliveryType,
                        null
                );

        return StorageFile.builder()
                .identifier(identifier)
                .url(url)
                .resourceType(resourceType)
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

        StorageResourceType resourceType =
                resolveResourceType(category);

        String deliveryType =
                resolveDeliveryType(category);

        try {

            cloudinary.uploader().destroy(
                    identifier,
                    ObjectUtils.asMap(
                            "resource_type",
                            resourceType.value(),

                            "type",
                            deliveryType
                    )
            );

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Unable to delete file from Cloudinary",
                    exception
            );
        }
    }

    private String buildPublicId(
            StorageCategory category
    ) {

        return String.join(
                "/",
                properties.getRootFolder(),
                resolveFolder(category),
                UUID.randomUUID().toString()
        );
    }

    private String resolveFolder(
            StorageCategory category
    ) {

        return switch (category) {

            case RESUMES ->
                    properties.getResumeFolder();

            case ARTICLE_IMAGES ->
                    properties.getArticleImageFolder();

            case VIDEO_THUMBNAILS ->
                    properties.getVideoThumbnailFolder();

            case GENERAL ->
                    properties.getGeneralFolder();
        };
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

    private String resolveDeliveryType(
            StorageCategory category
    ) {

        return switch (category) {

            case RESUMES ->
                    DELIVERY_TYPE_AUTHENTICATED;

            case ARTICLE_IMAGES,
                 VIDEO_THUMBNAILS,
                 GENERAL ->
                    DELIVERY_TYPE_UPLOAD;
        };
    }

    private String buildDeliveryUrl(
            String identifier,
            StorageResourceType resourceType,
            String deliveryType,
            String format
    ) {

        var builder =
                cloudinary
                        .url()
                        .secure(true)
                        .resourceType(
                                resourceType.value()
                        )
                        .type(deliveryType)
                        .version(
                                String.valueOf(
                                        Instant.now()
                                                .getEpochSecond()
                                )
                        );

        if (DELIVERY_TYPE_AUTHENTICATED
                .equals(deliveryType)) {

            builder =
                    builder
                            .signed(true);
        }

        String generatedUrl =
                builder.generate(identifier);

        if (StringUtils.hasText(format)
                && resourceType == StorageResourceType.RAW
                && !generatedUrl.endsWith(
                "." + format
        )) {

            return generatedUrl +
                    "." +
                    format;
        }

        return generatedUrl;
    }
}
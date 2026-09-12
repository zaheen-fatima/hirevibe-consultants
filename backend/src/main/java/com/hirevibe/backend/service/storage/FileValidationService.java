package com.hirevibe.backend.service.storage;

import com.hirevibe.backend.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class FileValidationService {

    private final StorageProperties properties;

    public void validate(
            MultipartFile file,
            StorageCategory category
    ) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "File is required"
            );
        }

        long maxFileSize =
                category == StorageCategory.RESUMES
                        ? properties.getMaxFileSize()
                        : properties.getMediaMaxFileSize();

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException(
                    "Uploaded file exceeds the configured maximum size"
            );
        }

        String filename =
                StringUtils.cleanPath(
                        file.getOriginalFilename() == null
                                ? ""
                                : file.getOriginalFilename()
                );

        if (!StringUtils.hasText(filename)) {
            throw new IllegalArgumentException(
                    "Filename is required"
            );
        }

        if (filename.contains("/")
                || filename.contains("\\")
                || filename.contains("..")) {

            throw new IllegalArgumentException(
                    "Invalid filename"
            );
        }

        if (category == StorageCategory.RESUMES) {
            validateResume(file, filename);
        }
    }

    private void validateResume(
            MultipartFile file,
            String filename
    ) {

        String extension =
                StringUtils.getFilenameExtension(filename);

        if (!StringUtils.hasText(extension)) {
            throw new IllegalArgumentException(
                    "File extension is required"
            );
        }

        boolean allowed =
                Arrays.stream(
                                properties
                                        .getAllowedResumeExtensions()
                        )
                        .anyMatch(
                                configuredExtension ->
                                        configuredExtension
                                                .equalsIgnoreCase(
                                                        extension
                                                )
                        );

        if (!allowed) {
            throw new IllegalArgumentException(
                    "Only configured resume file types are allowed"
            );
        }

        validateSignature(
                file,
                extension.toLowerCase(Locale.ROOT)
        );
    }

    private void validateSignature(
            MultipartFile file,
            String extension
    ) {

        try (InputStream inputStream =
                     file.getInputStream()) {

            byte[] header =
                    inputStream.readNBytes(8);

            switch (extension) {

                case "pdf" -> {

                    if (!startsWith(
                            header,
                            new byte[]{
                                    '%', 'P', 'D', 'F', '-'
                            }
                    )) {
                        throw new IllegalArgumentException(
                                "The uploaded file is not a valid PDF"
                        );
                    }
                }

                case "doc" -> {

                    if (!startsWith(
                            header,
                            new byte[]{
                                    (byte) 0xD0,
                                    (byte) 0xCF,
                                    (byte) 0x11,
                                    (byte) 0xE0,
                                    (byte) 0xA1,
                                    (byte) 0xB1,
                                    (byte) 0x1A,
                                    (byte) 0xE1
                            }
                    )) {
                        throw new IllegalArgumentException(
                                "The uploaded file is not a valid DOC document"
                        );
                    }
                }

                case "docx" -> {

                    if (!startsWith(
                            header,
                            new byte[]{
                                    'P',
                                    'K',
                                    0x03,
                                    0x04
                            }
                    )) {
                        throw new IllegalArgumentException(
                                "The uploaded file is not a valid DOCX document"
                        );
                    }
                }

                default -> throw new IllegalArgumentException(
                        "Unsupported file type"
                );
            }

        } catch (IOException exception) {

            throw new IllegalArgumentException(
                    "Unable to validate uploaded file",
                    exception
            );
        }
    }

    private boolean startsWith(
            byte[] actual,
            byte[] expected
    ) {

        if (actual.length < expected.length) {
            return false;
        }

        for (int index = 0;
             index < expected.length;
             index++) {

            if (actual[index] != expected[index]) {
                return false;
            }
        }

        return true;
    }
}
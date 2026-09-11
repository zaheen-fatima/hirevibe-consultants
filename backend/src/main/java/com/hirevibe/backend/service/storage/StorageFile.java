package com.hirevibe.backend.service.storage;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StorageFile {

    private final String identifier;

    private final String url;

    private final StorageResourceType resourceType;

    private final String format;

    private final long size;
}
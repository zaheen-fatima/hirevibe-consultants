package com.hirevibe.backend.service.storage;

public enum StorageResourceType {

    IMAGE("image"),

    RAW("raw"),

    VIDEO("video");

    private final String value;

    StorageResourceType(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }


}
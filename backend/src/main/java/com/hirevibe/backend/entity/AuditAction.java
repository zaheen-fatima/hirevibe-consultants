package com.hirevibe.backend.entity;

public enum AuditAction {

    LOGIN,
    LOGIN_FAILED,
    LOGOUT,

    CREATE,
    UPDATE,
    DELETE,

    PUBLISH,
    UNPUBLISH,

    STATUS_CHANGE,
    ACTIVATE,
    DEACTIVATE,

    UPLOAD,
    DOWNLOAD
}
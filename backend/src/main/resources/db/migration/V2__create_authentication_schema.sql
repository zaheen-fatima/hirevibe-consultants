-- ============================================================
-- HireVibe Authentication & Authorization Schema
-- Migration: V2
-- ============================================================

-- ------------------------------------------------------------
-- Permissions
-- ------------------------------------------------------------

CREATE TABLE permissions (
                             id BIGINT NOT NULL AUTO_INCREMENT,
                             name VARCHAR(100) NOT NULL,

                             CONSTRAINT pk_permissions
                                 PRIMARY KEY (id),

                             CONSTRAINT uk_permissions_name
                                 UNIQUE (name)
);


-- ------------------------------------------------------------
-- Roles
-- ------------------------------------------------------------

CREATE TABLE roles (
                       id BIGINT NOT NULL AUTO_INCREMENT,
                       name VARCHAR(50) NOT NULL,

                       CONSTRAINT pk_roles
                           PRIMARY KEY (id),

                       CONSTRAINT uk_roles_name
                           UNIQUE (name)
);


-- ------------------------------------------------------------
-- Role ↔ Permission relationship
-- ------------------------------------------------------------

CREATE TABLE role_permissions (
                                  role_id BIGINT NOT NULL,
                                  permission_id BIGINT NOT NULL,

                                  CONSTRAINT pk_role_permissions
                                      PRIMARY KEY (role_id, permission_id),

                                  CONSTRAINT fk_role_permissions_role
                                      FOREIGN KEY (role_id)
                                          REFERENCES roles (id)
                                          ON DELETE CASCADE,

                                  CONSTRAINT fk_role_permissions_permission
                                      FOREIGN KEY (permission_id)
                                          REFERENCES permissions (id)
                                          ON DELETE CASCADE
);


-- ------------------------------------------------------------
-- Users
-- ------------------------------------------------------------

CREATE TABLE users (
                       id BIGINT NOT NULL AUTO_INCREMENT,
                       email VARCHAR(150) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       name VARCHAR(100) NOT NULL,
                       role_id BIGINT NOT NULL,
                       enabled BOOLEAN NOT NULL DEFAULT TRUE,

                       CONSTRAINT pk_users
                           PRIMARY KEY (id),

                       CONSTRAINT uk_users_email
                           UNIQUE (email),

                       CONSTRAINT fk_users_role
                           FOREIGN KEY (role_id)
                               REFERENCES roles (id)
);


-- ============================================================
-- Initial Permissions
-- ============================================================

INSERT INTO permissions (name) VALUES
                                   ('USER_READ'),
                                   ('USER_CREATE'),
                                   ('USER_UPDATE'),
                                   ('USER_DELETE'),
                                   ('ROLE_READ'),
                                   ('ROLE_CREATE'),
                                   ('ROLE_UPDATE'),
                                   ('ROLE_DELETE');


-- ============================================================
-- Initial Roles
-- ============================================================

INSERT INTO roles (name) VALUES
                             ('ROLE_ADMIN'),
                             ('ROLE_USER');


-- ============================================================
-- ADMIN → All Permissions
-- ============================================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
         CROSS JOIN permissions p
WHERE r.name = 'ROLE_ADMIN';


-- ============================================================
-- USER → Basic Read Permission
-- ============================================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
         JOIN permissions p
              ON p.name = 'USER_READ'
WHERE r.name = 'ROLE_USER';
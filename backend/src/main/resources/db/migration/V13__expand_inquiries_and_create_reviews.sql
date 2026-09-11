ALTER TABLE inquiries
    ADD COLUMN company VARCHAR(200) NULL,
    ADD COLUMN service_type VARCHAR(100) NULL,
    ADD COLUMN hiring_requirement TEXT NULL,
    ADD COLUMN location VARCHAR(200) NULL;

CREATE INDEX idx_inquiries_service_type
    ON inquiries (service_type);

CREATE INDEX idx_inquiries_location
    ON inquiries (location);

CREATE TABLE reviews (
                         id BIGINT NOT NULL AUTO_INCREMENT,
                         name VARCHAR(150) NOT NULL,
                         role_title VARCHAR(150) NULL,
                         company VARCHAR(200) NULL,
                         rating INTEGER  NOT NULL,
                         review_text TEXT NOT NULL,
                         status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
                         created_at TIMESTAMP NOT NULL,
                         updated_at TIMESTAMP NOT NULL,
                         PRIMARY KEY (id),
                         CONSTRAINT chk_reviews_rating
                             CHECK (rating BETWEEN 1 AND 5)
);

CREATE INDEX idx_reviews_status
    ON reviews (status);

CREATE INDEX idx_reviews_created_at
    ON reviews (created_at);

INSERT INTO permissions (name)
SELECT 'REVIEW_READ'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'REVIEW_READ'
);

INSERT INTO permissions (name)
SELECT 'REVIEW_CREATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'REVIEW_CREATE'
);

INSERT INTO permissions (name)
SELECT 'REVIEW_UPDATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'REVIEW_UPDATE'
);

INSERT INTO permissions (name)
SELECT 'REVIEW_DELETE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'REVIEW_DELETE'
);

INSERT INTO role_permissions (
    role_id,
    permission_id
)
SELECT
    r.id,
    p.id
FROM roles r
         CROSS JOIN permissions p
WHERE r.name = 'ROLE_ADMIN'
  AND p.name IN (
                 'REVIEW_READ',
                 'REVIEW_CREATE',
                 'REVIEW_UPDATE',
                 'REVIEW_DELETE'
    )
  AND NOT EXISTS (
    SELECT 1
    FROM role_permissions rp
    WHERE rp.role_id = r.id
      AND rp.permission_id = p.id
);
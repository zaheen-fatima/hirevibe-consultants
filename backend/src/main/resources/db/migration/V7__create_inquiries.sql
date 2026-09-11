CREATE TABLE inquiries (
                           id BIGINT NOT NULL AUTO_INCREMENT,

                           name VARCHAR(150) NOT NULL,

                           email VARCHAR(255) NOT NULL,

                           phone VARCHAR(30) NOT NULL,

                           subject VARCHAR(200) NOT NULL,

                           message TEXT NOT NULL,

                           status VARCHAR(30) NOT NULL DEFAULT 'NEW',

                           admin_reply TEXT,

                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT pk_inquiries
                               PRIMARY KEY (id)
);

CREATE INDEX idx_inquiries_name
    ON inquiries(name);

CREATE INDEX idx_inquiries_email
    ON inquiries(email);

CREATE INDEX idx_inquiries_status
    ON inquiries(status);

CREATE INDEX idx_inquiries_created_at
    ON inquiries(created_at);

INSERT INTO permissions (name)
SELECT 'INQUIRY_READ'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'INQUIRY_READ'
);

INSERT INTO permissions (name)
SELECT 'INQUIRY_UPDATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'INQUIRY_UPDATE'
);

INSERT INTO permissions (name)
SELECT 'INQUIRY_DELETE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'INQUIRY_DELETE'
);
CREATE TABLE contacts (
                          id BIGINT NOT NULL AUTO_INCREMENT,

                          name VARCHAR(150) NOT NULL,

                          email VARCHAR(255) NOT NULL,

                          phone VARCHAR(30) NOT NULL,

                          subject VARCHAR(200) NOT NULL,

                          message TEXT NOT NULL,

                          status VARCHAR(30) NOT NULL DEFAULT 'NEW',

                          admin_reply TEXT,

                          replied_at TIMESTAMP NULL,

                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT pk_contacts
                              PRIMARY KEY (id)
);

CREATE INDEX idx_contacts_name
    ON contacts(name);

CREATE INDEX idx_contacts_email
    ON contacts(email);

CREATE INDEX idx_contacts_status
    ON contacts(status);

CREATE INDEX idx_contacts_created_at
    ON contacts(created_at);

INSERT INTO permissions (name)
SELECT 'CONTACT_READ'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'CONTACT_READ'
);

INSERT INTO permissions (name)
SELECT 'CONTACT_UPDATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'CONTACT_UPDATE'
);

INSERT INTO permissions (name)
SELECT 'CONTACT_DELETE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'CONTACT_DELETE'
);
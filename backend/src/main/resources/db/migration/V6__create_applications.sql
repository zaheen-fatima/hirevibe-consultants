INSERT INTO permissions (name)
SELECT 'APPLICATION_READ'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'APPLICATION_READ'
);

INSERT INTO permissions (name)
SELECT 'APPLICATION_UPDATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'APPLICATION_UPDATE'
);

INSERT INTO permissions (name)
SELECT 'APPLICATION_DELETE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'APPLICATION_DELETE'
);

CREATE TABLE applications (
                              id BIGINT NOT NULL AUTO_INCREMENT,

                              job_id BIGINT NOT NULL,

                              name VARCHAR(150) NOT NULL,
                              email VARCHAR(255) NOT NULL,
                              phone VARCHAR(30) NOT NULL,
                              qualification VARCHAR(255) NOT NULL,

                              resume_path VARCHAR(500) NOT NULL,

                              status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',

                              applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT pk_applications
                                  PRIMARY KEY (id),

                              CONSTRAINT fk_applications_job
                                  FOREIGN KEY (job_id)
                                      REFERENCES jobs(id)
                                      ON DELETE RESTRICT
);

CREATE INDEX idx_applications_job_id
    ON applications(job_id);

CREATE INDEX idx_applications_email
    ON applications(email);

CREATE INDEX idx_applications_status
    ON applications(status);

CREATE INDEX idx_applications_applied_at
    ON applications(applied_at);

CREATE INDEX idx_applications_job_status
    ON applications(job_id, status);
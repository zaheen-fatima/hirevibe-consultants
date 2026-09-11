CREATE TABLE jobs (
                      id BIGINT NOT NULL AUTO_INCREMENT,
                      title VARCHAR(150) NOT NULL,
                      location VARCHAR(150) NOT NULL,
                      description TEXT NOT NULL,
                      type VARCHAR(50) NOT NULL,
                      active BOOLEAN NOT NULL DEFAULT TRUE,
                      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                      CONSTRAINT pk_jobs PRIMARY KEY (id)
);

CREATE INDEX idx_jobs_title
    ON jobs(title);

CREATE INDEX idx_jobs_location
    ON jobs(location);

CREATE INDEX idx_jobs_type
    ON jobs(type);

CREATE INDEX idx_jobs_active
    ON jobs(active);

CREATE INDEX idx_jobs_created_at
    ON jobs(created_at);

INSERT INTO permissions (name)
SELECT 'JOB_READ'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'JOB_READ'
);

INSERT INTO permissions (name)
SELECT 'JOB_CREATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'JOB_CREATE'
);

INSERT INTO permissions (name)
SELECT 'JOB_UPDATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'JOB_UPDATE'
);

INSERT INTO permissions (name)
SELECT 'JOB_DELETE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'JOB_DELETE'
);
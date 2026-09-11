-- ============================================================
-- V11 - Audit Logging
-- ============================================================

CREATE TABLE audit_logs (
                            id BIGINT NOT NULL AUTO_INCREMENT,

                            user_id BIGINT,
                            user_email VARCHAR(255),

                            action VARCHAR(50) NOT NULL,
                            entity_type VARCHAR(100),
                            entity_id VARCHAR(100),

                            description VARCHAR(500),

                            ip_address VARCHAR(45),
                            user_agent VARCHAR(500),

                            metadata JSON,

                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                            CONSTRAINT pk_audit_logs
                                PRIMARY KEY (id),

                            CONSTRAINT fk_audit_logs_user
                                FOREIGN KEY (user_id)
                                    REFERENCES users(id)
                                    ON DELETE SET NULL
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_audit_logs_user_id
    ON audit_logs(user_id);

CREATE INDEX idx_audit_logs_action
    ON audit_logs(action);

CREATE INDEX idx_audit_logs_entity_type
    ON audit_logs(entity_type);

CREATE INDEX idx_audit_logs_entity_id
    ON audit_logs(entity_id);

CREATE INDEX idx_audit_logs_created_at
    ON audit_logs(created_at);

CREATE INDEX idx_audit_logs_user_created
    ON audit_logs(user_id, created_at);

-- ============================================================
-- Audit permission
-- ============================================================

INSERT INTO permissions (name)
SELECT 'AUDIT_READ'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'AUDIT_READ'
);
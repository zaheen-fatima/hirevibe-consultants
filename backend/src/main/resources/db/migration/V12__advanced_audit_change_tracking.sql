ALTER TABLE audit_logs
    ADD COLUMN before_state JSON NULL,
    ADD COLUMN after_state JSON NULL,
    ADD COLUMN changed_fields JSON NULL;
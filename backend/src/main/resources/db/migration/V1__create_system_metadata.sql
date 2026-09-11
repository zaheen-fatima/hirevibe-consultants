CREATE TABLE system_metadata (
                                 id BIGINT NOT NULL AUTO_INCREMENT,
                                 metadata_key VARCHAR(100) NOT NULL,
                                 metadata_value VARCHAR(500),
                                 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                 CONSTRAINT pk_system_metadata
                                     PRIMARY KEY (id),

                                 CONSTRAINT uk_system_metadata_key
                                     UNIQUE (metadata_key)
);
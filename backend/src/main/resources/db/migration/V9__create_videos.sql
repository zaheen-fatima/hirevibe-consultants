CREATE TABLE videos (
                        id BIGINT NOT NULL AUTO_INCREMENT,

                        title VARCHAR(200) NOT NULL,

                        slug VARCHAR(220) NOT NULL,

                        description VARCHAR(1000),

                        video_url VARCHAR(1000) NOT NULL,

                        thumbnail_url VARCHAR(1000),

                        category VARCHAR(100) NOT NULL,

                        published BOOLEAN NOT NULL DEFAULT FALSE,

                        featured BOOLEAN NOT NULL DEFAULT FALSE,

                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                        published_at TIMESTAMP NULL,

                        CONSTRAINT pk_videos
                            PRIMARY KEY (id),

                        CONSTRAINT uk_videos_slug
                            UNIQUE (slug)
);

CREATE INDEX idx_videos_title
    ON videos(title);

CREATE INDEX idx_videos_slug
    ON videos(slug);

CREATE INDEX idx_videos_category
    ON videos(category);

CREATE INDEX idx_videos_published
    ON videos(published);

CREATE INDEX idx_videos_featured
    ON videos(featured);

CREATE INDEX idx_videos_created_at
    ON videos(created_at);

CREATE INDEX idx_videos_published_at
    ON videos(published_at);


INSERT INTO permissions (name)
SELECT 'VIDEO_READ'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'VIDEO_READ'
);

INSERT INTO permissions (name)
SELECT 'VIDEO_CREATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'VIDEO_CREATE'
);

INSERT INTO permissions (name)
SELECT 'VIDEO_UPDATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'VIDEO_UPDATE'
);

INSERT INTO permissions (name)
SELECT 'VIDEO_DELETE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'VIDEO_DELETE'
);
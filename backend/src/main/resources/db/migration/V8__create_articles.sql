CREATE TABLE articles (
                          id BIGINT NOT NULL AUTO_INCREMENT,

                          title VARCHAR(200) NOT NULL,

                          slug VARCHAR(220) NOT NULL,

                          excerpt VARCHAR(500),

                          content LONGTEXT NOT NULL,

                          category VARCHAR(100) NOT NULL,

                          featured_image VARCHAR(500),

                          published BOOLEAN NOT NULL DEFAULT FALSE,

                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          published_at TIMESTAMP NULL,

                          CONSTRAINT pk_articles
                              PRIMARY KEY (id),

                          CONSTRAINT uk_articles_slug
                              UNIQUE (slug)
);

CREATE INDEX idx_articles_title
    ON articles(title);

CREATE INDEX idx_articles_slug
    ON articles(slug);

CREATE INDEX idx_articles_category
    ON articles(category);

CREATE INDEX idx_articles_published
    ON articles(published);

CREATE INDEX idx_articles_created_at
    ON articles(created_at);

CREATE INDEX idx_articles_published_at
    ON articles(published_at);


INSERT INTO permissions (name)
SELECT 'ARTICLE_READ'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'ARTICLE_READ'
);

INSERT INTO permissions (name)
SELECT 'ARTICLE_CREATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'ARTICLE_CREATE'
);

INSERT INTO permissions (name)
SELECT 'ARTICLE_UPDATE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'ARTICLE_UPDATE'
);

INSERT INTO permissions (name)
SELECT 'ARTICLE_DELETE'
    WHERE NOT EXISTS (
    SELECT 1
    FROM permissions
    WHERE name = 'ARTICLE_DELETE'
);
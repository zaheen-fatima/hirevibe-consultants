package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface VideoRepository
        extends JpaRepository<Video, Long>,
        JpaSpecificationExecutor<Video> {

    Optional<Video> findBySlug(
            String slug
    );

    boolean existsBySlug(
            String slug
    );

    boolean existsBySlugAndIdNot(
            String slug,
            Long id
    );

    long countByPublishedTrue();
}
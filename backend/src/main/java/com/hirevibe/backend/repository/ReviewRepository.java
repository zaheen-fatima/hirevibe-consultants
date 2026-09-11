package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.Review;
import com.hirevibe.backend.entity.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    Page<Review> findByStatus(
            ReviewStatus status,
            Pageable pageable
    );
}
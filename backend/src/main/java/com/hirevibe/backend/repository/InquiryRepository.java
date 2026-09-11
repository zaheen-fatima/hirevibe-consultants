package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface InquiryRepository
        extends JpaRepository<Inquiry, Long>,
        JpaSpecificationExecutor<Inquiry> {
}
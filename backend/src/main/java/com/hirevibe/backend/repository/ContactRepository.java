package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ContactRepository
        extends JpaRepository<Contact, Long>,
        JpaSpecificationExecutor<Contact> {
}
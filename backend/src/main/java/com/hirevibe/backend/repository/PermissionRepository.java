package com.hirevibe.backend.repository;

import com.hirevibe.backend.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionRepository
        extends JpaRepository<Permission, Long> {

    Optional<Permission> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);
}
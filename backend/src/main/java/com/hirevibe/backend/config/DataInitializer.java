package com.hirevibe.backend.config;

import com.hirevibe.backend.entity.Permission;
import com.hirevibe.backend.entity.Role;
import com.hirevibe.backend.entity.User;
import com.hirevibe.backend.repository.PermissionRepository;
import com.hirevibe.backend.repository.RoleRepository;
import com.hirevibe.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    private static final List<String> ADMIN_PERMISSIONS = List.of(
            "USER_READ",
            "USER_CREATE",
            "USER_UPDATE",
            "USER_DELETE",

            "ROLE_READ",
            "ROLE_CREATE",
            "ROLE_UPDATE",
            "ROLE_DELETE",

            "PERMISSION_READ",
            "PERMISSION_CREATE",
            "PERMISSION_UPDATE",
            "PERMISSION_DELETE",

            "JOB_READ",
            "JOB_CREATE",
            "JOB_UPDATE",
            "JOB_DELETE",

            "APPLICATION_READ",
            "APPLICATION_UPDATE",
            "APPLICATION_DELETE",

            "INQUIRY_READ",
            "INQUIRY_UPDATE",
            "INQUIRY_DELETE",

            "ARTICLE_READ",
            "ARTICLE_CREATE",
            "ARTICLE_UPDATE",
            "ARTICLE_DELETE",

            "VIDEO_READ",
            "VIDEO_CREATE",
            "VIDEO_UPDATE",
            "VIDEO_DELETE",

            // Contact Management
            "CONTACT_READ",
            "CONTACT_UPDATE",
            "CONTACT_DELETE",

            // Review Management
            "REVIEW_READ",
            "REVIEW_CREATE",
            "REVIEW_UPDATE",
            "REVIEW_DELETE",

            "AUDIT_READ"
    );

    @Bean
    CommandLineRunner initializeSecurityData() {

        return args -> initialize();
    }

    @Transactional
    protected void initialize() {

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() ->
                        new IllegalStateException(
                                "ROLE_ADMIN not found"
                        )
                );

        Set<Permission> adminPermissions = new HashSet<>();

        for (String permissionName : ADMIN_PERMISSIONS) {

            Permission permission = permissionRepository
                    .findByName(permissionName)
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "Required permission not found: "
                                            + permissionName
                            )
                    );

            adminPermissions.add(permission);
        }

        /*
         * Ensure ROLE_ADMIN always has all administrative permissions.
         */
        adminRole.setPermissions(adminPermissions);
        roleRepository.save(adminRole);

        /*
         * Create the development admin account only if it does not exist.
         */
        if (!userRepository.existsByEmail("admin@hirevibe.com")) {

            User admin = User.builder()
                    .name("HireVibe Admin")
                    .email("admin@hirevibe.com")
                    .password(
                            passwordEncoder.encode("Admin@12345")
                    )
                    .role(adminRole)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
        }
    }
}
//package com.hirevibe.backend.config;
//
//import com.hirevibe.backend.entity.Permission;
//import com.hirevibe.backend.entity.Role;
//import com.hirevibe.backend.repository.PermissionRepository;
//import com.hirevibe.backend.repository.RoleRepository;
//import com.hirevibe.backend.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//
//@Configuration
//@RequiredArgsConstructor
//public class DataInitializer {
//
//    private final UserRepository userRepository;
//
//    private final RoleRepository roleRepository;
//
//    private final PermissionRepository permissionRepository;
//
//    private final PasswordEncoder passwordEncoder;
//
//    private static final List<String> ADMIN_PERMISSIONS =
//            List.of(
//                    "USER_READ",
//                    "USER_CREATE",
//                    "USER_UPDATE",
//                    "USER_DELETE",
//
//                    "ROLE_READ",
//                    "ROLE_CREATE",
//                    "ROLE_UPDATE",
//                    "ROLE_DELETE",
//
//                    "PERMISSION_READ",
//                    "PERMISSION_CREATE",
//                    "PERMISSION_UPDATE",
//                    "PERMISSION_DELETE",
//
//                    "JOB_READ",
//                    "JOB_CREATE",
//                    "JOB_UPDATE",
//                    "JOB_DELETE",
//
//                    "APPLICATION_READ",
//                    "APPLICATION_UPDATE",
//                    "APPLICATION_DELETE",
//
//                    "INQUIRY_READ",
//                    "INQUIRY_UPDATE",
//                    "INQUIRY_DELETE",
//
//                    "CONTACT_READ",
//                    "CONTACT_UPDATE",
//                    "CONTACT_DELETE",
//
//                    "ARTICLE_READ",
//                    "ARTICLE_CREATE",
//                    "ARTICLE_UPDATE",
//                    "ARTICLE_DELETE",
//
//                    "VIDEO_READ",
//                    "VIDEO_CREATE",
//                    "VIDEO_UPDATE",
//                    "VIDEO_DELETE",
//
//                    "AUDIT_READ"
//            );
//
//    @Bean
//    CommandLineRunner initializeSecurityData() {
//        return args ->
//                initialize();
//    }
//
//    @Transactional
//    protected void initialize() {
//
//        Role adminRole =
//                roleRepository
//                        .findByName(
//                                "ROLE_ADMIN"
//                                )
//                        .orElseThrow(
//                                () ->
//                                        new IllegalStateException(
//                                                "ROLE_ADMIN not found"
//                                                )
//                                );
//
//        Set<Permission> adminPermissions =
//                new HashSet<>();
//
//        for (
//                String permissionName :
//                ADMIN_PERMISSIONS
//        ) {
//
//            Permission permission =
//                    permissionRepository
//                            .findByName(
//                                    permissionName
//                                    )
//                            .orElseThrow(
//                                    () ->
//                                            new IllegalStateException(
//                                                    "Required permission not found: "
//                                                            + permissionName
//                                                    )
//                                    );
//
//            adminPermissions.add(
//                    permission
//                    );
//        }
//
//        adminRole.setPermissions(
//                adminPermissions
//                );
//
//        roleRepository.save(
//                adminRole
//                );
//
//        if (
//                !userRepository.existsByEmail(
//                        "admin@hirevibe.com"
//                        )
//        ) {
//
//            var admin =
//                    com.hirevibe.backend.entity.User
//                            .builder()
//                            .name(
//                                    "HireVibe Admin"
//                                    )
//                            .email(
//                                    "admin@hirevibe.com"
//                                    )
//                            .password(
//                                    passwordEncoder.encode(
//                                            "Admin@12345"
//                                            )
//                                    )
//                            .role(
//                                    adminRole
//                                    )
//                            .enabled(
//                                    true
//                                    )
//                            .build();
//
//            userRepository.save(
//                    admin
//                    );
//        }
//    }
//}
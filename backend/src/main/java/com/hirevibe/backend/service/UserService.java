package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.DuplicateResourceException;
import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.user.CreateUserRequest;
import com.hirevibe.backend.dto.user.UpdateUserRequest;
import com.hirevibe.backend.dto.user.UserResponse;
import com.hirevibe.backend.entity.Role;
import com.hirevibe.backend.entity.User;
import com.hirevibe.backend.mapper.UserMapper;
import com.hirevibe.backend.repository.RoleRepository;
import com.hirevibe.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates a new user.
     */
    @Transactional
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public UserResponse createUser(CreateUserRequest request) {

        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException(
                    "A user already exists with email: " + email
            );
        }

        Role role = findRole(request.getRoleId());

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    /**
     * Returns users using database-level pagination.
     *
     * The database performs the pagination through Spring Data JPA.
     * The frontend should consume this Page response rather than
     * loading all users and paginating locally.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('USER_READ')")
    public Page<UserResponse> getAllUsers(Pageable pageable) {

        return userRepository.findAll(pageable)
                .map(userMapper::toResponse);
    }

    /**
     * Returns a single user by ID.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('USER_READ')")
    public UserResponse getUserById(Long id) {

        User user = findUser(id);

        return userMapper.toResponse(user);
    }

    /**
     * Updates user profile information and role.
     */
    @Transactional
    @PreAuthorize("hasAuthority('USER_UPDATE')")
    public UserResponse updateUser(
            Long id,
            UpdateUserRequest request
    ) {

        User user = findUser(id);

        if (request.getName() != null
                && !request.getName().isBlank()) {

            user.setName(request.getName().trim());
        }

        if (request.getEmail() != null
                && !request.getEmail().isBlank()) {

            String email = normalizeEmail(request.getEmail());

            if (userRepository.existsByEmailAndIdNot(
                    email,
                    id
            )) {
                throw new DuplicateResourceException(
                        "A user already exists with email: " + email
                );
            }

            user.setEmail(email);
        }

        if (request.getRoleId() != null) {

            Role role = findRole(request.getRoleId());

            user.setRole(role);
        }

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    /**
     * Permanently deletes a user.
     *
     * This operation requires USER_DELETE permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public void deleteUser(Long id) {

        User user = findUser(id);

        userRepository.delete(user);
    }

    /**
     * Enables a user account.
     */
    @Transactional
    @PreAuthorize("hasAuthority('USER_UPDATE')")
    public UserResponse enableUser(Long id) {

        User user = findUser(id);

        user.setEnabled(true);

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    /**
     * Disables a user account.
     */
    @Transactional
    @PreAuthorize("hasAuthority('USER_UPDATE')")
    public UserResponse disableUser(Long id) {

        User user = findUser(id);

        user.setEnabled(false);

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    /**
     * Finds a user or throws a standardized not-found exception.
     */
    private User findUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + id
                        )
                );
    }

    /**
     * Finds a role or throws a standardized not-found exception.
     */
    private Role findRole(Long roleId) {

        return roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found with ID: " + roleId
                        )
                );
    }

    /**
     * Normalizes email addresses before persistence.
     */
    private String normalizeEmail(String email) {

        return email.trim().toLowerCase();
    }
}
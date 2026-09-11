package com.hirevibe.backend.mapper;

import com.hirevibe.backend.dto.user.UserResponse;
import com.hirevibe.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(
                        user.getRole() != null
                                ? user.getRole().getName()
                                : null
                )
                .enabled(user.isEnabled())
                .build();
    }
}
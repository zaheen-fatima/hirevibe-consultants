package com.hirevibe.backend.dto.role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {

    private Long id;

    private String name;

    @Builder.Default
    private Set<String> permissions = Set.of();
}
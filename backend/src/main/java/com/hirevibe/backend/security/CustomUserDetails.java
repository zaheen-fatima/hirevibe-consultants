package com.hirevibe.backend.security;

import com.hirevibe.backend.entity.Permission;
import com.hirevibe.backend.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Long userId;
    private final String name;
    private final String email;
    private final String password;
    private final Set<GrantedAuthority> authorities;
    private final boolean enabled;

    public CustomUserDetails(User user) {
        this.userId = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.enabled = user.isEnabled();

        this.authorities = new HashSet<>();

        if (user.getRole() != null) {

            this.authorities.add(
                    new SimpleGrantedAuthority(user.getRole().getName())
            );

            if (user.getRole().getPermissions() != null) {
                for (Permission permission : user.getRole().getPermissions()) {
                    this.authorities.add(
                            new SimpleGrantedAuthority(permission.getName())
                    );
                }
            }
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
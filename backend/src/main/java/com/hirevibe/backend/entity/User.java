package com.hirevibe.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
//@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, unique = true, length = 150)
    private String email;


    @Column(nullable = false)
    private String password;


    @Column(nullable = false, length = 100)
    private String name;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;


    @Column(nullable = false)
    private boolean enabled = true;


    public User() {
    }

}
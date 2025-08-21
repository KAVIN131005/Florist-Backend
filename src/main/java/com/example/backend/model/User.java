package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  @Column(unique = true, nullable = false)
  private String email;
  private String password;

  @ElementCollection(fetch = FetchType.EAGER)
  @Enumerated(EnumType.STRING)
  private Set<Role> roles;

  // florist profile fields (optional)
  private String phone;
  private String address;
public void setUserRole(String role) {
    if (roles == null) {
        roles = new HashSet<>();
    }
    roles.add(Role.valueOf(role));
}

}

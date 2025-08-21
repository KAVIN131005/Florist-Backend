// dto/JwtResponse.java
package com.example.backend.dto;
import java.util.Set;
import com.example.backend.model.Role;
public record JwtResponse(String token, Long userId, String name, String email, Set<Role> roles, String message) {}

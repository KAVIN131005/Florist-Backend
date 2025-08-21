// dto/RegisterRequest.java
package com.example.backend.dto;
import jakarta.validation.constraints.*;
public record RegisterRequest(@NotBlank String name, @Email @NotBlank String email, @NotBlank String password) {}

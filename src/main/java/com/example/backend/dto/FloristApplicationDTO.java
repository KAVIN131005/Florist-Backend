// dto/FloristApplicationDTO.java
package com.example.backend.dto;
import jakarta.validation.constraints.NotBlank;
public record FloristApplicationDTO(@NotBlank String shopName, String description, String gstNumber) {}

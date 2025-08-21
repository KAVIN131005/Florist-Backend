// dto/CartItemDTO.java
package com.example.backend.dto;
import jakarta.validation.constraints.*;
public record CartItemDTO(@NotNull Long productId, @NotNull @Positive Integer grams) {}

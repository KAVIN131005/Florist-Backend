// dto/PaymentCreateDTO.java
package com.example.backend.dto;
import jakarta.validation.constraints.NotNull;

public record PaymentCreateDTO(@NotNull Long orderId) {}

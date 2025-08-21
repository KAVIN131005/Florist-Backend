package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PaymentConfirmDTO(
        @NotNull Long orderId,
        @NotBlank String razorpayPaymentId, // dummy payment id
        @NotBlank String razorpayOrderId,
        @NotBlank String razorpaySignature
) {}

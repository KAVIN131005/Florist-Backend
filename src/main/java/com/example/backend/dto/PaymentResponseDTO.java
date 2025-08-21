// dto/PaymentResponseDTO.java
package com.example.backend.dto;

public record PaymentResponseDTO(
  String razorpayOrderId, String keyId, Double amount
) {}

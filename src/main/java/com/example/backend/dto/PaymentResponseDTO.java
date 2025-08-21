package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponseDTO {
    private String razorpayOrderId; // dummy ID
    private String keyId;           // dummy key
    private Double amount;
}

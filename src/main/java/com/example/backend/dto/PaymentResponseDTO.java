package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponseDTO {
    private String razorpayOrderId; // Razorpay order ID
    private String keyId;           // Razorpay key ID  
    private Integer amount;         // Amount in paise
    private String currency;        // Currency (INR)
    
    // Backward compatibility constructor
    public PaymentResponseDTO(String razorpayOrderId, String keyId, Double amount) {
        this.razorpayOrderId = razorpayOrderId;
        this.keyId = keyId;
        this.amount = amount != null ? (int)(amount * 100) : 0; // Convert to paise
        this.currency = "INR";
    }
}

package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private Long userId;
    private Long floristId;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<Item> items;
    
    // Payment information
    private PaymentInfo payment;

    // Custom constructor for service layer
    public OrderResponseDTO(Long id, Instant createdAt, String userName, Double totalAmount, List<Item> items) {
        this.id = id;
        this.createdAt = createdAt != null ? LocalDateTime.ofInstant(createdAt, java.time.ZoneOffset.UTC) : null;
        this.totalAmount = totalAmount;
        this.items = items;
        // Set other fields that we don't use in the simple response
        this.userId = null; // We can get this from the user context if needed
        this.floristId = null; // Not used in current response
        this.status = "CREATED"; // Default status
        this.payment = null; // Will be set separately if needed
    }
    
    // Enhanced constructor with payment info
    public OrderResponseDTO(Long id, Instant createdAt, String userName, Double totalAmount, 
                           List<Item> items, String status, PaymentInfo payment) {
        this.id = id;
        this.createdAt = createdAt != null ? LocalDateTime.ofInstant(createdAt, java.time.ZoneOffset.UTC) : null;
        this.totalAmount = totalAmount;
        this.items = items;
        this.status = status;
        this.payment = payment;
        this.userId = null;
        this.floristId = null;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentInfo {
        private String status; // CREATED, SUCCESS, FAILED
        private LocalDateTime paidAt;
        private Double floristShare; // 80% of total
        private Double adminShare;   // 20% of total
        private String razorpayPaymentId;
    }

    @Data
    @AllArgsConstructor
    public static class Item {
        private Long productId;
        private String productName;
        private Integer grams;
        private Double pricePer100g;
        private Double subtotal;
    }
}
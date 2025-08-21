package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponseDTO {

    public OrderResponseDTO(Long id2, Instant createdAt2, String name, Double totalAmount2, List<Item> items2) {
                //TODO Auto-generated constructor stub
        }

    private Long id;
    private Long userId;
    private Long floristId;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<Item> items;

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
// dto/OrderCreateDTO.java
package com.example.backend.dto;

import java.util.List;

public record OrderCreateDTO(
    String address,
    List<CartItemRequest> cartItems,
    DiscountInfo discount,
    ShippingInfo shipping
) {
    public record CartItemRequest(Long productId, Integer quantity) {}
    public record DiscountInfo(String code, Double amount) {}
    public record ShippingInfo(Double cost, String type, Boolean isFree) {}
}

// dto/OrderCreateDTO.java
package com.example.backend.dto;

import java.util.List;

public record OrderCreateDTO(
    String address,
    List<CartItemRequest> cartItems
) {
    public record CartItemRequest(Long productId, Integer quantity) {}
}

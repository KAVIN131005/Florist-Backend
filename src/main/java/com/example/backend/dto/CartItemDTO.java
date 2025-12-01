// dto/CartItemDTO.java
package com.example.backend.dto;
import jakarta.validation.constraints.*;

public record CartItemDTO(
    @NotNull Long productId, 
    Integer grams,  // Optional - for gram-based input
    Integer quantity // Optional - for quantity-based input (will be converted to grams)
) {
    // Constructor validation
    public CartItemDTO {
        if (grams == null && quantity == null) {
            throw new IllegalArgumentException("Either grams or quantity must be provided");
        }
        if (grams != null && quantity != null) {
            throw new IllegalArgumentException("Provide either grams or quantity, not both");
        }
    }
    
    // Helper method to get grams value
    public int getGrams() {
        if (grams != null) return grams;
        if (quantity != null) return quantity * 100; // Convert quantity to grams
        throw new IllegalStateException("No valid grams or quantity value");
    }
}

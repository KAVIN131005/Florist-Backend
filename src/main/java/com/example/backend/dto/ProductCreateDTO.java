package com.example.backend.dto;

import jakarta.validation.constraints.*;

public record ProductCreateDTO(
       String name,
        @Size(max = 4000) String description,
        String imageUrl,
        Long categoryId,          // optional if newCategoryName is provided
        Double pricePer100g,
        Integer stockGrams,
        Boolean featured,
        String newCategoryName    // optional new category
) {}

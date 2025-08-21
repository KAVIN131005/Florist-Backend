package com.example.backend.dto;

public record ProductResponseDTO(
        Long id,
        String name,
        String description,
        String imageUrl,
        Double pricePer100g,
        Integer stockGrams,
        Long categoryId,
        String categoryName,
        Long floristId,
        String floristName,
        Boolean featured
) {}

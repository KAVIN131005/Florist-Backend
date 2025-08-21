// src/main/java/com/example/backend/model/Product.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(indexes = {
        @Index(name = "idx_product_active", columnList = "active"),
        @Index(name = "idx_product_featured", columnList = "featured"),
        @Index(name = "idx_product_category", columnList = "category"),
        @Index(name = "idx_product_name", columnList = "name")
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic info
    private String name;
    @Column(length = 4000)
    private String description;
    private String imageUrl;

    // Pricing/stock
    private Double pricePer100g;
    private Integer stockGrams;

  
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)  // ✅ links to Category table
    private Category category;
    // Owner
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User florist;

    // Flags
    private Boolean active;
    private Boolean featured;
}

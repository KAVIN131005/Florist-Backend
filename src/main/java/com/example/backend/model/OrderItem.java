package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false) private Order order;
  @ManyToOne(optional = false) private Product product;
  private Integer grams;
  private Double pricePer100g; // snapshot
  private Double subtotal;     // (grams / 100.0) * pricePer100g
}

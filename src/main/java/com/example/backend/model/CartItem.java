package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CartItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false) private Cart cart;
  @ManyToOne(optional = false) private Product product;

  // multiples of 100g
  private Integer grams;

  // snapshot price at time of adding (per 100g)
  private Double pricePer100gAtAdd;
}

package com.example.backend.controller;

import com.example.backend.dto.CartItemDTO;
import com.example.backend.model.Cart;
import com.example. backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/cart") @RequiredArgsConstructor
public class CartController {
  private final CartService cartService;

  @GetMapping
  public Cart myCart() { return cartService.getMyCart(); }

  @PostMapping("/items")
  public Cart addItem(@RequestBody @Valid CartItemDTO dto) { return cartService.addItem(dto); }

  @PutMapping("/items/{itemId}")
  public Cart updateItem(@PathVariable Long itemId, @RequestParam int grams) {
    return cartService.updateItem(itemId, grams);
  }

  @DeleteMapping("/items/{itemId}")
  public Cart remove(@PathVariable Long itemId) { return cartService.removeItem(itemId); }
}

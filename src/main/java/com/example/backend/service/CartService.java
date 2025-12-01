package com.example.backend.service;

import com.example. backend.dto.CartItemDTO;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service @RequiredArgsConstructor
public class CartService {
  private final CartRepository cartRepo;
  private final CartItemRepository cartItemRepo;
  private final ProductRepository productRepo;
  private final UserService userService;

  private Cart getOrCreateCart(User u) {
    Optional<Cart> existing = cartRepo.findByUser(u);
    return existing.orElseGet(() -> cartRepo.save(Cart.builder().user(u).build()));
  }

  @Transactional
  public Cart addItem(CartItemDTO dto) {
    // Use the DTO's getGrams() method which handles both grams and quantity conversion
    int grams = dto.getGrams();
    if (grams % 100 != 0) throw new RuntimeException("Grams must be in 100g steps");
    User u = userService.getCurrentUser();
    Cart cart = getOrCreateCart(u);
    Product p = productRepo.findById(dto.productId()).orElseThrow();
    CartItem item = CartItem.builder()
        .cart(cart).product(p).grams(grams).pricePer100gAtAdd(p.getPricePer100g()).build();
    cart.getItems().add(item);
    cartRepo.save(cart);
    return cart;
  }

  @Transactional
  public Cart updateItem(Long itemId, int grams) {
    if (grams % 100 != 0) throw new RuntimeException("Grams must be in 100g steps");
    User u = userService.getCurrentUser();
    Cart cart = cartRepo.findByUser(u).orElseThrow();
    CartItem item = cart.getItems().stream().filter(ci -> ci.getId().equals(itemId)).findFirst().orElseThrow();
    item.setGrams(grams);
    cartRepo.save(cart);
    return cart;
  }

  @Transactional
  public Cart removeItem(Long itemId) {
    User u = userService.getCurrentUser();
    Cart cart = cartRepo.findByUser(u).orElseThrow();
    cart.getItems().removeIf(ci -> ci.getId().equals(itemId));
    cartRepo.save(cart);
    return cart;
  }

  public Cart getMyCart() {
    return getOrCreateCart(userService.getCurrentUser());
  }

  @Transactional
  public void clearCart(User u) {
    cartRepo.findByUser(u).ifPresent(c -> { c.getItems().clear(); cartRepo.save(c); });
  }

  @Transactional
  public void clearMyCart() {
    clearCart(userService.getCurrentUser());
  }
}

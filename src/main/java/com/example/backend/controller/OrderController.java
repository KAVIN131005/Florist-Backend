package com.example.backend.controller;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.backend.dto.OrderCreateDTO;
import com.example.backend.dto.OrderResponseDTO;
import com.example.backend.model.Order;
import com.example.backend.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/orders") @RequiredArgsConstructor
public class OrderController {
  private final OrderService orderService;

  @PostMapping
  public OrderResponseDTO create(@RequestBody @Valid OrderCreateDTO dto) {
    // Check if cart items are provided directly (from frontend)
    if (dto.cartItems() != null && !dto.cartItems().isEmpty()) {
      return orderService.createFromCartItemsAsDTO(dto.address(), dto.cartItems());
    } else {
      // Fallback to database cart approach
      Order o = orderService.createFromCart(dto.address());
      return orderService.toDTO(o);
    }
  }

  @GetMapping
  @Transactional(readOnly = true)
  public List<OrderResponseDTO> myOrders() {
    return orderService.getMyOrdersAsDTO();
  }

  // Order tracking endpoint - get specific order by ID
  @GetMapping("/{id}")
  @Transactional(readOnly = true)
  public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
    try {
      OrderResponseDTO order = orderService.getOrderByIdAsDTO(id);
      return ResponseEntity.ok(order);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  // Update order status (for admin/florist)
  @PutMapping("/{id}/status")
  @PreAuthorize("hasRole('ADMIN') or hasRole('FLORIST')")
  public ResponseEntity<OrderResponseDTO> updateOrderStatus(
      @PathVariable Long id, 
      @RequestParam String status) {
    try {
      OrderResponseDTO updatedOrder = orderService.updateOrderStatus(id, status);
      return ResponseEntity.ok(updatedOrder);
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  // Admin: Get all orders
  @GetMapping("/admin/all")
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional(readOnly = true)
  public List<OrderResponseDTO> getAllOrdersForAdmin() {
    return orderService.getAllOrdersAsDTO();
  }
}

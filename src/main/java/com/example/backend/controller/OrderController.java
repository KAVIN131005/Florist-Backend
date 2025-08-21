package com.example.backend.controller;

import com.example.backend.dto.OrderCreateDTO;
import com.example.backend.dto.OrderResponseDTO;
import com.example. backend.model.Order;
import com.example.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/orders") @RequiredArgsConstructor
public class OrderController {
  private final OrderService orderService;

  @PostMapping
  public OrderResponseDTO create(@RequestBody @Valid OrderCreateDTO dto) {
    Order o = orderService.createFromCart(dto.address());
    return orderService.toDTO(o);
  }

  @GetMapping
  public List<OrderResponseDTO> myOrders() {
    return orderService.myOrders().stream().map(orderService::toDTO).toList();
  }
}

package com.example.backend.service;

import com.example.backend.dto.OrderResponseDTO;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final CartRepository cartRepo;
    private final UserService userService;

    @Transactional
    public Order createFromCart(String address) {
        User user = userService.getCurrentUser();
        Cart cart = cartRepo.findByUser(user).orElseThrow(() -> new RuntimeException("Cart empty"));
        if (cart.getItems().isEmpty()) throw new RuntimeException("Cart empty");

        Order order = Order.builder().user(user).createdAt(Instant.now())
            .status(Order.Status.CREATED).totalAmount(0.0).build();
        orderRepo.save(order);

        double total = 0.0;
        for (CartItem ci : cart.getItems()) {
            double subtotal = (ci.getGrams() / 100.0) * ci.getPricePer100gAtAdd();
            total += subtotal;
            OrderItem oi = OrderItem.builder()
                .order(order).product(ci.getProduct()).grams(ci.getGrams())
                .pricePer100g(ci.getPricePer100gAtAdd()).subtotal(subtotal).build();
            orderItemRepo.save(oi);
        }
        order.setTotalAmount(total);
        orderRepo.save(order);

        cart.getItems().clear();
        cartRepo.save(cart);
        return order;
    }

    public List<Order> myOrders() {
        return orderRepo.findByUser(userService.getCurrentUser());
    }

    public List<OrderResponseDTO> getAllOrders() {
        return orderRepo.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public OrderResponseDTO toDTO(Order o) {
        var items = o.getItems().stream().map(i ->
            new OrderResponseDTO.Item(
                i.getProduct().getId(),
                i.getProduct().getName(),
                i.getGrams(),
                i.getPricePer100g(),
                i.getSubtotal()
            )
        ).toList();
        return new OrderResponseDTO(
            o.getId(),
            o.getCreatedAt(),
            o.getUser().getName(),
            o.getTotalAmount(),
            items
        );
    }
}
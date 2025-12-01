package com.example.backend.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.OrderCreateDTO;
import com.example.backend.dto.OrderResponseDTO;
import com.example.backend.model.Cart;
import com.example.backend.model.CartItem;
import com.example.backend.model.Order;
import com.example.backend.model.OrderItem;
import com.example.backend.model.Payment;
import com.example.backend.model.Product;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.ProductRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    @PersistenceContext
    private EntityManager entityManager;
    
    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final CartRepository cartRepo;
    private final UserService userService;
    private final ProductRepository productRepo;
    private final PaymentRepository paymentRepo;

    @Transactional
    public Order createFromCart(String address) {
        User user = userService.getCurrentUser();
        Cart cart = cartRepo.findByUser(user).orElse(null);
        
        // If cart exists and has items, use it
        if (cart != null && !cart.getItems().isEmpty()) {
            return createOrderFromDbCart(user, cart, address);
        } else {
            throw new RuntimeException("Cart empty - please add items to cart");
        }
    }

    @Transactional
    public OrderResponseDTO createFromCartItemsAsDTO(String address, List<OrderCreateDTO.CartItemRequest> cartItems) {
        User user = userService.getCurrentUser();
        
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart items cannot be empty");
        }

        Order order = Order.builder()
            .user(user)
            .createdAt(Instant.now())
            .status(Order.Status.CREATED)
            .totalAmount(0.0)
            .build();
        orderRepo.save(order);

        double total = 0.0;
        List<OrderResponseDTO.Item> dtoItems = new ArrayList<>();
        
        for (OrderCreateDTO.CartItemRequest item : cartItems) {
            Product product = productRepo.findById(item.productId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + item.productId()));
            
            // Calculate based on quantity instead of grams for frontend compatibility
            double subtotal = item.quantity() * product.getPricePer100g();
            total += subtotal;
            
            OrderItem oi = OrderItem.builder()
                .order(order)
                .product(product)
                .grams(item.quantity() * 100) // Convert quantity to grams (100g per unit)
                .pricePer100g(product.getPricePer100g())
                .subtotal(subtotal)
                .build();
            orderItemRepo.save(oi);
            
            // Build DTO item immediately while we have access to the product
            dtoItems.add(new OrderResponseDTO.Item(
                product.getId(),
                product.getName(),
                oi.getGrams(),
                oi.getPricePer100g(),
                oi.getSubtotal()
            ));
        }
        
        order.setTotalAmount(total);
        orderRepo.save(order);
        
        // Return DTO directly to avoid lazy loading issues
        return new OrderResponseDTO(
            order.getId(),
            order.getCreatedAt(),
            user.getName(),
            order.getTotalAmount(),
            dtoItems
        );
    }

    @Transactional
    public Order createFromCartItems(String address, List<OrderCreateDTO.CartItemRequest> cartItems) {
        User user = userService.getCurrentUser();
        
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart items cannot be empty");
        }

        Order order = Order.builder()
            .user(user)
            .createdAt(Instant.now())
            .status(Order.Status.CREATED)
            .totalAmount(0.0)
            .build();
        orderRepo.save(order);

        double total = 0.0;
        for (OrderCreateDTO.CartItemRequest item : cartItems) {
            Product product = productRepo.findById(item.productId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + item.productId()));
            
            // Calculate based on quantity instead of grams for frontend compatibility
            double subtotal = item.quantity() * product.getPricePer100g();
            total += subtotal;
            
            OrderItem oi = OrderItem.builder()
                .order(order)
                .product(product)
                .grams(item.quantity() * 100) // Convert quantity to grams (100g per unit)
                .pricePer100g(product.getPricePer100g())
                .subtotal(subtotal)
                .build();
            orderItemRepo.save(oi);
        }
        
        order.setTotalAmount(total);
        orderRepo.save(order);
        return order;
    }

    private Order createOrderFromDbCart(User user, Cart cart, String address) {
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

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getMyOrdersAsDTO() {
        User currentUser = userService.getCurrentUser();
        
        // Use JPQL to fetch orders with items in one query to avoid lazy loading
        List<Order> orders = entityManager.createQuery(
            "SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.items i " +
            "LEFT JOIN FETCH i.product p " +
            "LEFT JOIN FETCH p.florist " +
            "WHERE o.user = :user " +
            "ORDER BY o.createdAt DESC", Order.class)
            .setParameter("user", currentUser)
            .getResultList();
            
        return orders.stream()
            .map(this::toDTOWithPaymentInfo)
            .collect(Collectors.toList());
    }
    
    private OrderResponseDTO toDTOWithPaymentInfo(Order o) {
        var items = o.getItems().stream().map(i ->
            new OrderResponseDTO.Item(
                i.getProduct().getId(),
                i.getProduct().getName(),
                i.getGrams(),
                i.getPricePer100g(),
                i.getSubtotal()
            )
        ).toList();
        
        // Fetch payment information
        OrderResponseDTO.PaymentInfo paymentInfo = null;
        try {
            Payment payment = paymentRepo.findByOrder(o).orElse(null);
            if (payment != null) {
                paymentInfo = new OrderResponseDTO.PaymentInfo(
                    payment.getStatus().toString(),
                    payment.getPaidAt() != null ? LocalDateTime.ofInstant(payment.getPaidAt(), java.time.ZoneOffset.UTC) : null,
                    payment.getFloristShare(),
                    payment.getAdminShare(),
                    payment.getRazorpayPaymentId()
                );
            }
        } catch (Exception e) {
            // Payment not found or error - that's okay for orders without payment
        }
        
        return new OrderResponseDTO(
            o.getId(),
            o.getCreatedAt(),
            o.getUser().getName(),
            o.getTotalAmount(),
            items,
            o.getStatus().toString(),
            paymentInfo
        );
    }

    public List<Order> myOrders() {
        return orderRepo.findByUser(userService.getCurrentUser());
    }

    public OrderResponseDTO getOrderByIdAsDTO(Long orderId) {
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check if current user has access to this order
        User currentUser = userService.getCurrentUser();
        if (!order.getUser().getId().equals(currentUser.getId()) && 
            !currentUser.getRoles().contains(Role.ADMIN)) {
            throw new RuntimeException("Access denied to this order");
        }
        
        return toDTOWithPaymentInfo(order);
    }

    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        try {
            Order.Status newStatus = Order.Status.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
            orderRepo.save(order);
            return toDTOWithPaymentInfo(order);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    public List<OrderResponseDTO> getAllOrdersAsDTO() {
        List<Order> orders = entityManager.createQuery(
            "SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.items i " +
            "LEFT JOIN FETCH i.product p " +
            "LEFT JOIN FETCH p.florist " +
            "LEFT JOIN FETCH o.user " +
            "ORDER BY o.createdAt DESC", Order.class)
            .getResultList();
            
        return orders.stream()
            .map(this::toDTOWithPaymentInfo)
            .collect(Collectors.toList());
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
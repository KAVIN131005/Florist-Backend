package com.example.backend.repository;

import com.example.backend.model.Payment;
import com.example.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder(Order order);
    Optional<Payment> findByRazorpayOrderId(String orderId);
}

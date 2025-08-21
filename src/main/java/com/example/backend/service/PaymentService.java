package com.example.backend.service;

import com.example.backend.dto.PaymentResponseDTO;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;
    private final WalletService walletService;
    private final UserRepository userRepo;

    // 1️⃣ Create dummy payment
    public PaymentResponseDTO createDummyPayment(Long orderId) {
        Order ord = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // generate dynamic dummy payment ID
        String dummyPaymentId = UUID.randomUUID().toString();

        Payment payment = paymentRepo.findByOrder(ord)
                .orElse(Payment.builder()
                        .order(ord)
                        .amount(ord.getTotalAmount())
                        .status(Payment.Status.CREATED)
                        .razorpayPaymentId(dummyPaymentId)
                        .build()
                );
        paymentRepo.save(payment);

        return new PaymentResponseDTO(dummyPaymentId, "DUMMY_KEY", ord.getTotalAmount());
    }

    // 2️⃣ Confirm dummy payment
    @Transactional
    public void confirmDummyPayment(Long orderId, String dummyPaymentId) {
        Order ord = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment pay = paymentRepo.findByOrder(ord)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Update payment status
        pay.setStatus(Payment.Status.SUCCESS);
        pay.setPaidAt(Instant.now());
        paymentRepo.save(pay);

        // calculate shares dynamically
        double floristShare = ord.getItems().stream().mapToDouble(i -> i.getSubtotal() * 0.6).sum();
        double adminShare = ord.getTotalAmount() - floristShare;
        pay.setFloristShare(floristShare);
        pay.setAdminShare(adminShare);

        // credit wallets
        ord.getItems().forEach(oi -> {
            User florist = oi.getProduct().getFlorist();
            walletService.credit(florist, oi.getSubtotal() * 0.6);
        });
        User admin = userRepo.findAll().stream()
                .filter(u -> u.getRoles().contains(Role.ADMIN))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        walletService.credit(admin, adminShare);

        // set order status paid
        ord.setStatus(Order.Status.PAID);
        orderRepo.save(ord);
    }
}

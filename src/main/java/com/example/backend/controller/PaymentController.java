package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.PaymentConfirmDTO;
import com.example.backend.dto.PaymentResponseDTO;
import com.example.backend.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    // 1️⃣ Create Razorpay payment order
    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponseDTO> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            PaymentResponseDTO response = paymentService.createRazorpayOrder(request.orderId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to create payment order", e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 2️⃣ Verify and confirm Razorpay payment
    @PostMapping("/success")
    public ResponseEntity<String> confirmPayment(
            @RequestParam Long orderId,
            @RequestParam String razorpay_order_id,
            @RequestParam String razorpay_payment_id,
            @RequestParam String razorpay_signature) {
        try {
            paymentService.verifyAndConfirmPayment(orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
            return ResponseEntity.ok("Payment verified and confirmed successfully!");
        } catch (Exception e) {
            log.error("Payment verification failed", e);
            return ResponseEntity.badRequest().body("Payment verification failed: " + e.getMessage());
        }
    }

    // 3️⃣ Legacy endpoints for backward compatibility
    @PostMapping("/create/{orderId}")
    public ResponseEntity<PaymentResponseDTO> createDummyPayment(@PathVariable Long orderId) {
        try {
            PaymentResponseDTO response = paymentService.createDummyPayment(orderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to create payment", e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmDummyPayment(@RequestBody @Valid PaymentConfirmDTO dto) {
        try {
            // Use new verification method if signature is provided
            if (dto.razorpaySignature() != null && !dto.razorpaySignature().isEmpty()) {
                paymentService.verifyAndConfirmPayment(
                    dto.orderId(),
                    dto.razorpayOrderId(),
                    dto.razorpayPaymentId(),
                    dto.razorpaySignature()
                );
            } else {
                // Fallback to old method for backward compatibility
                paymentService.confirmDummyPayment(dto.orderId(), dto.razorpayPaymentId());
            }
            return ResponseEntity.ok("Payment confirmed successfully!");
        } catch (Exception e) {
            log.error("Payment confirmation failed", e);
            return ResponseEntity.badRequest().body("Payment confirmation failed: " + e.getMessage());
        }
    }

    // Helper record for create order request
    public record CreateOrderRequest(Long orderId) {}
}

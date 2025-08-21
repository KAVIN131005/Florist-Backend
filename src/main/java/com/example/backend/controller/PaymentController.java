package com.example.backend.controller;

import com.example.backend.dto.PaymentConfirmDTO;
import com.example.backend.dto.PaymentResponseDTO;
import com.example.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // 1️⃣ Create dummy payment
    @PostMapping("/create/{orderId}")
    public ResponseEntity<PaymentResponseDTO> createDummyPayment(@PathVariable Long orderId) {
        PaymentResponseDTO response = paymentService.createDummyPayment(orderId);
        return ResponseEntity.ok(response);
    }

    // 2️⃣ Confirm dummy payment
    @PostMapping("/confirm")
    public ResponseEntity<String> confirmDummyPayment(@RequestBody @Valid PaymentConfirmDTO dto) {
        paymentService.confirmDummyPayment(
                dto.orderId(),
                dto.razorpayPaymentId()  // dummy payment ID
        );
        return ResponseEntity.ok("Payment confirmed successfully!");
    }
}

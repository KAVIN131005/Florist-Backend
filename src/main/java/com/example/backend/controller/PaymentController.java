package com.example.backend.controller;

import com.example. backend.dto.ApiResponse;
import com.example.backend.dto.PaymentCreateDTO;
import com.example.backend.dto.PaymentResponseDTO;
import com.example.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/payments") @RequiredArgsConstructor
public class PaymentController {
  private final PaymentService paymentService;

  @PostMapping("/create-order")
  public PaymentResponseDTO createOrder(@RequestBody @Valid PaymentCreateDTO dto) throws Exception {
    return paymentService.createRazorpayOrder(dto.orderId());
  }

  @PostMapping("/success")
  public ApiResponse success(
      @RequestParam Long orderId,
      @RequestParam String razorpay_order_id,
      @RequestParam String razorpay_payment_id,
      @RequestParam String razorpay_signature
  ) throws Exception {
    paymentService.confirmSuccess(orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
    return new ApiResponse(true, "Payment recorded & split applied");
  }
}

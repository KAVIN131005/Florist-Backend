package com.example.backend.service;

import com.example.backend.dto.PaymentResponseDTO;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Service @RequiredArgsConstructor
public class PaymentService {
  private final PaymentRepository paymentRepo;
  private final OrderRepository orderRepo;
  private final WalletService walletService;
  private final UserRepository userRepo;

  @Value("${razorpay.key.id}") private String keyId;
  @Value("${razorpay.key.secret}") private String keySecret;

  public PaymentResponseDTO createRazorpayOrder(Long orderId) throws Exception {
    com.example.backend.model.Order ord = orderRepo.findById(orderId).orElseThrow();
    RazorpayClient client = new RazorpayClient(keyId, keySecret);
    JSONObject req = new JSONObject();
    req.put("amount", Math.round(ord.getTotalAmount() * 100)); // paise
    req.put("currency", "INR");
    req.put("receipt", "order_rcpt_"+orderId);
    Order rOrder = client.orders.create(req);

    // Ensure payment record exists
    paymentRepo.findByOrder(ord).orElse(
        paymentRepo.save(Payment.builder().order(ord).amount(ord.getTotalAmount())
            .status(Payment.Status.CREATED).razorpayOrderId(rOrder.get("id")).build())
    );
    return new PaymentResponseDTO(rOrder.get("id"), keyId, ord.getTotalAmount());
  }

  // simple signature verification without webhook
  private boolean verifySignature(String orderId, String paymentId, String signature) throws Exception {
    String payload = orderId + "|" + paymentId;
    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
    byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
    
    StringBuilder hexString = new StringBuilder();
    for (byte b : hash) {
        String hex = Integer.toHexString(0xff & b);
        if (hex.length() == 1) {
            hexString.append('0');
        }
        hexString.append(hex);
    }
    String expected = hexString.toString();
    return expected.equals(signature);
  }

  @Transactional
  public void confirmSuccess(Long orderId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) throws Exception {
    if (!verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature))
      throw new RuntimeException("Invalid Razorpay signature");

    com.example.backend.model.Order ord = orderRepo.findById(orderId).orElseThrow();
    Payment pay = paymentRepo.findByOrder(ord).orElseThrow();
    pay.setRazorpayPaymentId(razorpayPaymentId);
    pay.setRazorpaySignature(razorpaySignature);
    pay.setStatus(Payment.Status.SUCCESS);
    pay.setPaidAt(Instant.now());

    double floristShare = ord.getItems().stream().mapToDouble(i -> i.getSubtotal() * 0.60).sum();
    double adminShare = ord.getTotalAmount() - floristShare;
    pay.setFloristShare(floristShare);
    pay.setAdminShare(adminShare);
    paymentRepo.save(pay);

    // credit all involved florists proportionally
    for (OrderItem oi : ord.getItems()) {
      User florist = oi.getProduct().getFlorist();
      double share = oi.getSubtotal() * 0.60;
      walletService.credit(florist, share);
    }

    // credit admin
    User admin = userRepo.findAll().stream().filter(u -> u.getRoles().contains(Role.ADMIN)).findFirst().orElseThrow();
    walletService.credit(admin, adminShare);

    ord.setStatus(com.example.backend.model.Order.Status.PAID);
    orderRepo.save(ord);
  }
}

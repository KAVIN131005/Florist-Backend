package com.example.backend.service;

import java.time.Instant;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.config.RazorpayConfig;
import com.example.backend.dto.PaymentResponseDTO;
import com.example.backend.model.Payment;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;
    private final WalletService walletService;
    private final UserRepository userRepo;
    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;

    // 1️⃣ Create Razorpay payment order
    public PaymentResponseDTO createRazorpayOrder(Long orderId) {
        com.example.backend.model.Order ord = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            // Convert amount to paise (Razorpay expects amount in smallest currency unit)
            int amountInPaise = (int) (ord.getTotalAmount() * 100);
            
            // Create Razorpay order
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + orderId);
            orderRequest.put("payment_capture", 1); // Auto capture
            
            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");
            
            log.info("Created Razorpay order {} for order {}", razorpayOrderId, orderId);
            
            // Create or update payment record
            Payment payment = paymentRepo.findByOrder(ord)
                    .orElse(Payment.builder()
                            .order(ord)
                            .amount(ord.getTotalAmount())
                            .status(Payment.Status.CREATED)
                            .build()
                    );
            
            payment.setRazorpayOrderId(razorpayOrderId);
            paymentRepo.save(payment);
            
            return new PaymentResponseDTO(
                razorpayOrderId, 
                razorpayConfig.getRazorpayKeyId(), 
                amountInPaise,
                "INR"
            );
            
        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order for order {}", orderId, e);
            throw new RuntimeException("Failed to create payment order: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error creating Razorpay order for order {}", orderId, e);
            throw new RuntimeException("Failed to create payment order: " + e.getMessage());
        }
    }

    // 2️⃣ Verify and confirm Razorpay payment
    @Transactional
    public void verifyAndConfirmPayment(Long orderId, String razorpayOrderId, 
                                      String razorpayPaymentId, String razorpaySignature) {
        com.example.backend.model.Order ord = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = paymentRepo.findByOrder(ord)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        try {
            // Verify payment signature
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);
            
            boolean isSignatureValid = Utils.verifyPaymentSignature(attributes, razorpayConfig.getRazorpayKeySecret());
            
            if (!isSignatureValid) {
                log.error("Invalid payment signature for order {}", orderId);
                throw new RuntimeException("Payment signature verification failed");
            }
            
            log.info("Payment verification successful for order {}", orderId);
            
            // Update payment status
            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setRazorpaySignature(razorpaySignature);
            payment.setStatus(Payment.Status.SUCCESS);
            payment.setPaidAt(Instant.now());
            
            // Calculate shares: 80% to florist, 20% to admin
            double floristShare = ord.getItems().stream().mapToDouble(i -> i.getSubtotal() * 0.8).sum();
            double adminShare = ord.getTotalAmount() - floristShare;
            payment.setFloristShare(floristShare);
            payment.setAdminShare(adminShare);
            
            paymentRepo.save(payment);
            
            // Credit wallets with 80% florist / 20% admin split
            ord.getItems().forEach(oi -> {
                User florist = oi.getProduct().getFlorist();
                walletService.credit(florist, oi.getSubtotal() * 0.8);
            });
            
            User admin = userRepo.findAll().stream()
                    .filter(u -> u.getRoles().contains(Role.ADMIN))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            walletService.credit(admin, adminShare);
            
            // Update order status to PAID
            ord.setStatus(com.example.backend.model.Order.Status.PAID);
            orderRepo.save(ord);
            
            log.info("Order {} payment completed successfully", orderId);
            
        } catch (RazorpayException e) {
            log.error("Razorpay verification failed for order {}", orderId, e);
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during payment verification for order {}", orderId, e);
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }
    
    // Keep the old dummy payment method for backward compatibility
    public PaymentResponseDTO createDummyPayment(Long orderId) {
        return createRazorpayOrder(orderId);
    }
    
    @Transactional
    public void confirmDummyPayment(Long orderId, String paymentId) {
        // For backward compatibility, this now just confirms without signature verification
        com.example.backend.model.Order ord = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = paymentRepo.findByOrder(ord)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        payment.setRazorpayPaymentId(paymentId);
        payment.setStatus(Payment.Status.SUCCESS);
        payment.setPaidAt(Instant.now());
        paymentRepo.save(payment);
        
        // Calculate and credit shares
        double floristShare = ord.getItems().stream().mapToDouble(i -> i.getSubtotal() * 0.6).sum();
        double adminShare = ord.getTotalAmount() - floristShare;
        payment.setFloristShare(floristShare);
        payment.setAdminShare(adminShare);
        
        ord.getItems().forEach(oi -> {
            User florist = oi.getProduct().getFlorist();
            walletService.credit(florist, oi.getSubtotal() * 0.6);
        });
        
        User admin = userRepo.findAll().stream()
                .filter(u -> u.getRoles().contains(Role.ADMIN))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        walletService.credit(admin, adminShare);
        
        ord.setStatus(com.example.backend.model.Order.Status.PAID);
        orderRepo.save(ord);
    }
}

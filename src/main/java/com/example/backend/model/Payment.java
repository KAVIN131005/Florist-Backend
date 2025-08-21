package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    private Order order;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private Double amount; // INR
    private Double floristShare; // 60%
    private Double adminShare;   // 40%

    @Enumerated(EnumType.STRING)
    private Status status;

    private Instant paidAt;

    public enum Status { CREATED, SUCCESS, FAILED }
}

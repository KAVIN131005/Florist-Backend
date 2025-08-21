package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FloristApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User applicant;  // <-- This is the user who applied

    private String shopName;
    private String description;
    private String gstNumber;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Instant createdAt;
    private Instant decidedAt;

    public enum Status { PENDING, APPROVED, DENIED, REJECTED }

    // ✅ Fix: Return the applicant instead of throwing exception
    public User getUser() {
        return this.applicant;
    }
}

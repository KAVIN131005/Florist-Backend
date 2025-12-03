package com.example.backend.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Entity
@Getter
@AllArgsConstructor
@Builder
public class FloristApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User applicant;  // <-- This is the user who applied

    private String shopName;
    
    @Column(length = 2000) // Allow up to 2000 characters for description
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

	public void setDecidedAt(Instant now) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'setDecidedAt'");
	}
}

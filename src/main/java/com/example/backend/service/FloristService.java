package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.FloristApplicationRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FloristService {

    private final FloristApplicationRepository appRepo;
    private final UserRepository userRepository;

    // Get all florist applications
    public List<FloristApplicationResponseDTO> getAllFloristApplications() {
        return appRepo.findAll().stream()
                .map(a -> new FloristApplicationResponseDTO(
                        a.getId(),
                        a.getShopName(),
                        a.getDescription(),
                        a.getStatus().name(),
                        a.getApplicant().getName()
                )).toList();
    }

    // Get approved florists
    public List<FloristApplication> getApprovedFlorists() {
        return appRepo.findByStatus(FloristApplication.Status.APPROVED);
    }

    // Apply as a florist
    @Transactional
    public FloristApplication apply(String shopName, String description, String gstin) {
        User applicant = getCurrentUser();
        FloristApplication application = FloristApplication.builder()
                .applicant(applicant)
                .shopName(shopName)
                .description(description)
                .gstNumber(gstin)
                .status(FloristApplication.Status.PENDING)
                .createdAt(Instant.now())
                .build();
        return appRepo.save(application);
    }

    // Get pending applications
    public List<FloristApplication> pending() {
        return appRepo.findByStatus(FloristApplication.Status.PENDING);
    }

    // Approve or deny application
    @Transactional
    public void decide(Long id, boolean approve) {
        FloristApplication app = appRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Florist application not found"));

        app.setStatus(approve ? FloristApplication.Status.APPROVED : FloristApplication.Status.DENIED);
        app.setDecidedAt(Instant.now());
        appRepo.save(app);

        if (approve) {
            User user = app.getApplicant();
            user.getRoles().add(Role.FLORIST);
            userRepository.save(user);
        }
    }

    // Get pending applications with DTO
    public List<FloristApplicationResponseDTO> getPendingFloristApplications() {
        return appRepo.findByStatus(FloristApplication.Status.PENDING).stream()
                .map(a -> new FloristApplicationResponseDTO(
                        a.getId(),
                        a.getShopName(),
                        a.getDescription(),
                        a.getStatus().name(),
                        a.getApplicant().getName()
                )).toList();
    }

    // ✅ Helper: Get currently authenticated user
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        // In your JWT filter, principal is set as email (String)
        String email;
        if (auth.getPrincipal() instanceof String) {
            email = (String) auth.getPrincipal();
        } else if (auth.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            email = userDetails.getUsername();
        } else {
            throw new RuntimeException("Cannot extract user from authentication");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // DTO for responses
    public record FloristApplicationResponseDTO(Long id, String shopName, String description, String status, String applicantName) {}
}

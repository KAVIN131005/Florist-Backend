package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.FloristApplicationRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FloristService {
    private final FloristApplicationRepository appRepo;
    private final UserRepository userRepository;

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

    public List<FloristApplication> getApprovedFlorists() {
        return appRepo.findByStatus(FloristApplication.Status.APPROVED);
    }

    @Transactional
    public FloristApplication apply(String shopName, String description, String gstin) {
        User applicant = userRepository.findById(getCurrentUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        FloristApplication application = FloristApplication.builder()
            .applicant(applicant)
            .shopName(shopName)
            .description(description)
            .gstin(gstin)
            .status(FloristApplication.Status.PENDING)
            .createdAt(Instant.now())
            .build();
        return appRepo.save(application);
    }

    public List<FloristApplication> pending() {
        return appRepo.findByStatus(FloristApplication.Status.PENDING);
    }

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

    private Long getCurrentUserId() {
        // Placeholder: Implement actual logic to get current user ID (e.g., from SecurityContext)
        // Example using Spring Security:
        // return SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        throw new UnsupportedOperationException("Implement getCurrentUserId based on your auth mechanism");
    }

    // ✅ New method to get only pending applications
public List<FloristApplicationResponseDTO> getPendingFloristApplications() {
    return appRepo.findByStatus(FloristApplication.Status.PENDING)
            .stream()
            .map(a -> new FloristApplicationResponseDTO(
                    a.getId(),
                    a.getShopName(),
                    a.getDescription(),
                    a.getStatus().name(),
                    a.getApplicant().getName()
            )).toList();
}


    public record FloristApplicationResponseDTO(Long id, String shopName, String description, String status, String applicantName) {}
  }
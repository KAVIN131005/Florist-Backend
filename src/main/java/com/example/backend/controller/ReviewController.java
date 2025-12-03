package com.example.backend.controller;

import com.example.backend.dto.ReviewCreateDTO;
import com.example.backend.dto.ReviewResponseDTO;
import com.example.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDTO>> getProductReviews(@PathVariable Long productId) {
        log.info("Fetching reviews for product: {}", productId);
        List<ReviewResponseDTO> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<Map<String, Object>> getProductReviewStats(@PathVariable Long productId) {
        log.info("Fetching review stats for product: {}", productId);
        Double averageRating = reviewService.getAverageRating(productId);
        Long reviewCount = reviewService.getReviewCount(productId);
        
        Map<String, Object> stats = Map.of(
            "averageRating", averageRating != null ? averageRating : 0.0,
            "reviewCount", reviewCount
        );
        
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping("/product/{productId}")
    @PreAuthorize("hasRole('USER') or hasRole('FLORIST') or hasRole('ADMIN')")
    public ResponseEntity<ReviewResponseDTO> createReview(
            @PathVariable Long productId, 
            @Valid @RequestBody ReviewCreateDTO reviewDTO) {
        log.info("Creating review for product: {} with rating: {}", productId, reviewDTO.getRating());
        ReviewResponseDTO review = reviewService.createReview(productId, reviewDTO);
        return ResponseEntity.ok(review);
    }
}
package com.example.backend.service;

import com.example.backend.dto.ReviewCreateDTO;
import com.example.backend.dto.ReviewResponseDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Product;
import com.example.backend.model.Review;
import com.example.backend.model.User;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getProductReviews(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Double getAverageRating(Long productId) {
        return reviewRepository.findAverageRatingByProductId(productId);
    }
    
    @Transactional(readOnly = true)
    public Long getReviewCount(Long productId) {
        return reviewRepository.countByProductId(productId);
    }
    
    @Transactional
    public ReviewResponseDTO createReview(Long productId, ReviewCreateDTO reviewDTO) {
        // Get current authenticated user
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Check if product exists
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        // Check if user already reviewed this product
        if (reviewRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new IllegalStateException("You have already reviewed this product");
        }
        
        // Create review
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(reviewDTO.getRating());
        review.setText(reviewDTO.getText());
        
        Review savedReview = reviewRepository.save(review);
        log.info("Review created for product {} by user {} with rating {}", 
                productId, userEmail, reviewDTO.getRating());
        
        return convertToDTO(savedReview);
    }
    
    private ReviewResponseDTO convertToDTO(Review review) {
        ReviewResponseDTO.UserInfo userInfo = new ReviewResponseDTO.UserInfo();
        userInfo.setId(review.getUser().getId());
        userInfo.setName(review.getUser().getName());
        userInfo.setUsername(review.getUser().getEmail()); // Using email as username
        
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setText(review.getText());
        dto.setRating(review.getRating());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUser(userInfo);
        
        return dto;
    }
}
package com.example.backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    /** ✅ Get currently authenticated user (throws exception if not found) */
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            throw new ResourceNotFoundException("User not authenticated");
        }

        Object principal = auth.getPrincipal();
        
        // Handle string principal (email from JWT filter)
        if (principal instanceof String) {
            String email = (String) principal;
            if ("anonymousUser".equals(email)) {
                throw new ResourceNotFoundException("Anonymous user cannot access this resource");
            }
            
            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
            
            // Eagerly load roles to prevent lazy loading issues
            user.getRoles().size();
            return user;
        }
        
        throw new ResourceNotFoundException("Invalid authentication principal type");
    }

    /** ✅ Get all users */
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    /** ✅ Delete user by ID */
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepo.deleteById(id);
    }
}


package com.example.backend.service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.FloristApplication;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.FloristApplicationRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final FloristApplicationRepository floristApplicationRepository;

    public void approveFlorist(Long floristId) {
        FloristApplication app = floristApplicationRepository.findById(floristId)
                .orElseThrow(() -> new ResourceNotFoundException("Florist not found"));

        app.setStatus(FloristApplication.Status.APPROVED);
        floristApplicationRepository.save(app);

        User user = app.getApplicant();
        user.getRoles().add(Role.FLORIST);
        userRepository.save(user);
    }

    public void rejectFlorist(Long floristId) {
        FloristApplication app = floristApplicationRepository.findById(floristId)
                .orElseThrow(() -> new ResourceNotFoundException("Florist not found"));

        app.setStatus(FloristApplication.Status.REJECTED);
        floristApplicationRepository.save(app);
    }
}


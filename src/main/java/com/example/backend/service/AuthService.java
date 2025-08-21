package com.example.backend.service;

import com.example.backend.config.JwtUtil;
import com.example.backend.dto.*;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepo;
  private final PasswordEncoder encoder;
  private final JwtUtil jwtUtil;
  private final WalletService walletService;

  public ApiResponse register(RegisterRequest req) {
    if (userRepo.findByEmail(req.email()).isPresent())
      return new ApiResponse(false, "Email already registered");
    User u = User.builder()
        .name(req.name()).email(req.email())
        .password(encoder.encode(req.password()))
        .roles(Set.of(Role.USER)).build();
    userRepo.save(u);
    walletService.ensureWalletExists(u);
    return new ApiResponse(true, "Registered successfully");
  }

  public JwtResponse login(LoginRequest req) {
    User u = userRepo.findByEmail(req.email()).orElseThrow(() -> new RuntimeException("Invalid credentials"));
    if (!encoder.matches(req.password(), u.getPassword())) throw new RuntimeException("Invalid credentials");
    String token = jwtUtil.generateToken(u.getEmail(), Map.of("roles", u.getRoles()));
    return new JwtResponse(token, u.getId(), u.getName(), u.getEmail(), u.getRoles(), "Login successful");
  }
}

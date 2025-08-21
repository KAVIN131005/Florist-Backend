package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;

  @PostMapping("/register")
  public ApiResponse register(@RequestBody @Valid RegisterRequest req) {
    return authService.register(req);
  }

  @PostMapping("/login")
  public JwtResponse login(@RequestBody @Valid LoginRequest req) {
    return authService.login(req);
  }
}

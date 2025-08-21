package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import com.example.backend.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/user") @RequiredArgsConstructor
public class UserController {
  private final UserService userService;
  private final WalletService walletService;

  @GetMapping("/me")
  public User me() { return userService.getCurrentUser(); }

  @GetMapping("/wallet/balance")
  public ApiResponse balance() {
    User u = userService.getCurrentUser();
    return new ApiResponse(true, String.valueOf(walletService.getBalance(u)));
  }
}

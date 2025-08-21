package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.FloristApplicationDTO;
import com.example.backend.model.FloristApplication;
import com.example.backend.service.FloristService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/florist") @RequiredArgsConstructor
public class FloristController {
  private final FloristService floristService;

  @PostMapping("/apply")
  public FloristApplication apply(@RequestBody @Valid FloristApplicationDTO dto) {
    return floristService.apply(dto.shopName(), dto.description(), dto.gstNumber());
  }

  @GetMapping("/applications/pending")
  @PreAuthorize("hasRole('ADMIN')")
  public List<FloristApplication> pending() { return floristService.pending(); }

  @PostMapping("/applications/{id}/approve")
  @PreAuthorize("hasRole('ADMIN')")
  public ApiResponse approve(@PathVariable Long id) {
    floristService.decide(id, true);
    return new ApiResponse(true, "Approved");
  }

  @PostMapping("/applications/{id}/deny")
  @PreAuthorize("hasRole('ADMIN')")
  public ApiResponse deny(@PathVariable Long id) {
    floristService.decide(id, false);
    return new ApiResponse(true, "Denied");
  }
}

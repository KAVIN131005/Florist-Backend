package com.example.backend.config;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {
  private final UserRepository userRepo;
  private final PasswordEncoder encoder;
  private final WalletService walletService;

  @Value("${app.admin.email}") private String adminEmail;
  @Value("${app.admin.password}") private String adminPassword;
  @Value("${app.admin.name}") private String adminName;

  @Override
  public void run(String... args) {
    userRepo.findByEmail(adminEmail).ifPresentOrElse(u -> {}, () -> {
      User admin = new User();
      admin.setName(adminName);
      admin.setEmail(adminEmail);
      admin.setPassword(encoder.encode(adminPassword));
      admin.setRoles(Set.of(Role.ADMIN));
      userRepo.save(admin);
      walletService.ensureWalletExists(admin); // admin wallet
    });
  }
}

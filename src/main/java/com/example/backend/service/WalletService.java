package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.model.Wallet;
import com.example.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class WalletService {
  private final WalletRepository walletRepo;

  @Transactional
  public void ensureWalletExists(User user) {
    walletRepo.findByOwner(user).orElseGet(() -> walletRepo.save(Wallet.builder().owner(user).balance(0.0).build()));
  }

  @Transactional
  public void credit(User user, double amount) {
    Wallet w = walletRepo.findByOwner(user).orElseThrow();
    w.setBalance((w.getBalance() == null ? 0.0 : w.getBalance()) + amount);
    walletRepo.save(w);
  }

  public double getBalance(User user) {
    return walletRepo.findByOwner(user).map(Wallet::getBalance).orElse(0.0);
  }
}

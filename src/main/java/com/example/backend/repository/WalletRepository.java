// repository/WalletRepository.java
package com.example.backend.repository;
import com.example.backend.model.User;
import com.example.backend.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
  Optional<Wallet> findByOwner(User owner);
}

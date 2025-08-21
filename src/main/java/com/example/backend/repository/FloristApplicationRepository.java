// repository/FloristApplicationRepository.java
package com.example.backend.repository;
import com.example.backend.model.FloristApplication;
import com.example.backend.model.FloristApplication.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FloristApplicationRepository extends JpaRepository<FloristApplication, Long> {
  List<FloristApplication> findByStatus(Status status);
  boolean existsByApplicantIdAndStatus(Long userId, Status status);
}

// repository/OrderRepository.java
package com.example.backend.repository;
import com.example.backend.model.Order;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.user = :user ORDER BY o.createdAt DESC")
    List<Order> findByUser(@Param("user") User user);
}

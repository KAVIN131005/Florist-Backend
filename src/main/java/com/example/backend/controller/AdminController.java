package com.example.backend.controller;

import com.example.backend.dto.FloristApplicationDTO;
import com.example.backend.dto.OrderResponseDTO;
import com.example.backend.service.AdminService;
import com.example.backend.service.FloristService;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import com.example.backend.model.Role;  // Import your application's Role enum

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final FloristService floristService;
    private final OrderService orderService;

    // ✅ Get all users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ Delete user
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    // ✅ Get all florist applications (pending / approved / rejected)
    @GetMapping("/florists")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getAllFlorists() {
        return ResponseEntity.ok(floristService.getAllFloristApplications());
    }

    // ✅ Get only pending applications
    @GetMapping("/florists/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getPendingFlorists() {
        return ResponseEntity.ok(floristService.getPendingFloristApplications());
    }

    // ✅ Approve florist
    @PostMapping("/florists/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> approveFlorist(@PathVariable Long id) {
        adminService.approveFlorist(id);
        return ResponseEntity.ok("Florist approved successfully!");
    }

    // ✅ Reject florist
    @PostMapping("/florists/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> rejectFlorist(@PathVariable Long id) {
        adminService.rejectFlorist(id);
        return ResponseEntity.ok("Florist rejected!");
    }

    // ✅ Get all orders
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
@GetMapping("/stats")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Object> getPlatformStats() {
    double platformEarnings = orderService.getAllOrders().stream()
            .mapToDouble(OrderResponseDTO::getTotalAmount)
            .sum();
    long totalUsers = userService.getAllUsers().size();
    long totalFlorists = userService.getAllUsers().stream()
            .filter(u -> u.getRoles().contains(Role.FLORIST))
            .count();
    long totalOrders = orderService.getAllOrders().size();

    return ResponseEntity.ok(new Object() {
        public double platformEarnings1 = platformEarnings;
        public long totalUsers1 = totalUsers;
        public long totalFlorists1 = totalFlorists;
        public long totalOrders1 = totalOrders;
    });
}

}

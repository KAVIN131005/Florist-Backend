package com.example.backend.controller;

import com.example.backend.dto.FloristApplicationDTO;
import com.example.backend.dto.OrderResponseDTO;
import com.example.backend.service.AdminService;
import com.example.backend.service.FloristService;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import com.example.backend.service.PaymentService;
import com.example.backend.model.Role;  // Import your application's Role enum

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final FloristService floristService;
    private final OrderService orderService;
    private final PaymentService paymentService;

    // Debug endpoint to check current user authentication
    @GetMapping("/debug/auth")
    public ResponseEntity<Object> debugAuth() {
        try {
            log.info("Debug auth endpoint called");
            Object authInfo = new Object() {
                public String message = "Authentication debug info";
                public String timestamp = java.time.Instant.now().toString();
            };
            return ResponseEntity.ok(authInfo);
        } catch (Exception e) {
            log.error("Debug auth error", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // Temporary debug endpoints without role restrictions
    @GetMapping("/debug/orders")
    public ResponseEntity<Object> debugOrders() {
        try {
            log.info("Debug orders endpoint called");
            List<OrderResponseDTO> orders = orderService.getAllOrders();
            log.info("Retrieved {} orders for debug", orders.size());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("Debug orders error", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/debug/stats")
    public ResponseEntity<Object> debugStats() {
        try {
            log.info("Debug stats endpoint called");
            PaymentService.PlatformStatsDTO earnings = paymentService.getPlatformEarnings();
            
            Object response = new Object() {
                public double adminEarnings = earnings.adminEarnings;
                public double floristEarnings = earnings.floristEarnings;
                public double totalRevenue = earnings.totalRevenue;
                public int totalPaidOrders = earnings.totalPaidOrders;
                public String debug = "No auth required";
            };
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Debug stats error", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

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

    // ✅ Get all orders - TEMPORARILY REMOVE ROLE RESTRICTION FOR DEBUGGING
    @GetMapping("/orders")
    // @PreAuthorize("hasRole('ADMIN')")  // Commented out for debugging
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        log.info("Admin orders endpoint called");
        try {
            List<OrderResponseDTO> orders = orderService.getAllOrders();
            log.info("Successfully retrieved {} orders", orders.size());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("Error fetching admin orders", e);
            throw e;
        }
    }
@GetMapping("/stats")
// @PreAuthorize("hasRole('ADMIN')")  // Commented out for debugging
public ResponseEntity<Object> getPlatformStats() {
    log.info("Admin stats endpoint called");
    try {
        // Get actual earnings from payment data instead of order totals
        PaymentService.PlatformStatsDTO earnings = paymentService.getPlatformEarnings();
        
        long totalUsers = userService.getAllUsers().size();
        long totalFlorists = userService.getAllUsers().stream()
                .filter(u -> u.getRoles().contains(Role.FLORIST))
                .count();
        // Use count query instead of loading all orders to avoid lazy loading issues
        long totalOrders = orderService.getOrderCount();

        Object response = new Object() {
            public double platformEarnings1 = earnings.adminEarnings;
            public double floristEarnings1 = earnings.floristEarnings;
            public double totalRevenue1 = earnings.totalRevenue;
            public long totalUsers1 = totalUsers;
            public long totalFlorists1 = totalFlorists;
            public long totalOrders1 = totalOrders;
            public int totalPaidOrders1 = earnings.totalPaidOrders;
        };
        
        log.info("Successfully generated admin stats: Admin=₹{}, Florist=₹{}, Total=₹{}", 
                 earnings.adminEarnings, earnings.floristEarnings, earnings.totalRevenue);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        log.error("Error fetching admin stats", e);
        throw e;
    }
}

}

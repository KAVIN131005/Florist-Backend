// src/main/java/com/example/backend/controller/ProductController.java
package com.example.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ProductCreateDTO;
import com.example.backend.dto.ProductResponseDTO;
import com.example.backend.model.User;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;
    private final UserService userService;

    // GET /api/products?q=&category=&minPrice=&maxPrice=&page=&size=
    @GetMapping
    public Page<ProductResponseDTO> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return productService.list(q, category, minPrice, maxPrice, page, size);
    }

    @GetMapping("/featured")
    public java.util.List<ProductResponseDTO> featured(@RequestParam(required = false) Integer limit) {
        return productService.getFeaturedProducts(limit);
    }

    // Florist's own products
    @GetMapping("/mine")
    public java.util.List<ProductResponseDTO> myProducts(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "12") int size
    ) {
        log.info("GET /api/products/mine - Fetching products for current user");
        User florist = userService.getCurrentUser();
        log.info("Current user: {} (ID: {})", florist.getEmail(), florist.getId());
        java.util.List<ProductResponseDTO> products = productService.findByFlorist(florist);
        log.info("Found {} products for florist", products.size());
        return products;
    }

    @PostMapping
    public ProductResponseDTO create(@RequestBody @Valid ProductCreateDTO dto) {
        return productService.create(dto);
    }

    @PutMapping("/{id}")
    public ProductResponseDTO update(@PathVariable Long id, @RequestBody @Valid ProductCreateDTO dto) {
        return productService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }

    @GetMapping("/{id}")
public ProductResponseDTO getById(@PathVariable Long id) {
    return productService.getById(id);
}

}

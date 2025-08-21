// src/main/java/com/example/backend/controller/ProductController.java
package com.example.backend.controller;

import com.example.backend.dto.ProductCreateDTO;
import com.example.backend.dto.ProductResponseDTO;
import com.example.backend.model.User;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

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
    public java.util.List<ProductResponseDTO> myProducts() {
        User florist = userService.getCurrentUser();
        return productService.findByFlorist(florist);
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

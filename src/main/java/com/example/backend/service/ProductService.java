package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.ProductCreateDTO;
import com.example.backend.dto.ProductResponseDTO;
import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final UserService userService;
    private final ReviewService reviewService;

    // CREATE PRODUCT
    @Transactional
    public ProductResponseDTO create(ProductCreateDTO dto) {
        // Validate required fields manually
        if (dto.name() == null || dto.name().isBlank()) {
            throw new RuntimeException("Product name must not be blank");
        }
        if ((dto.categoryId() == null) && (dto.newCategoryName() == null || dto.newCategoryName().isBlank())) {
            throw new RuntimeException("Category or newCategoryName must be provided");
        }

        User florist = userService.getCurrentUser();
        if (florist == null || florist.getRoles() == null || !florist.getRoles().contains(Role.FLORIST)) {
            throw new RuntimeException("Not a florist");
        }

        Category category = resolveCategory(dto);

        Product p = Product.builder()
                .name(dto.name())
                .description(dto.description())
                .imageUrl(dto.imageUrl())
                .category(category)
                .florist(florist)
                .pricePer100g(dto.pricePer100g())
                .stockGrams(dto.stockGrams())
                .active(true)
                .featured(dto.featured())
                .build();

        p = productRepo.save(p);
        return toDTO(p);
    }

    // UPDATE PRODUCT
    @Transactional
    public ProductResponseDTO update(Long id, ProductCreateDTO dto) {
        // Validate required fields manually
        if (dto.name() == null || dto.name().isBlank()) {
            throw new RuntimeException("Product name must not be blank");
        }
        if ((dto.categoryId() == null) && (dto.newCategoryName() == null || dto.newCategoryName().isBlank())) {
            throw new RuntimeException("Category or newCategoryName must be provided");
        }

        User florist = userService.getCurrentUser();
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!p.getFlorist().getId().equals(florist.getId())) {
            throw new RuntimeException("Not owner");
        }

        Category category = resolveCategory(dto);

        p.setName(dto.name());
        p.setDescription(dto.description());
        p.setImageUrl(dto.imageUrl());
        p.setPricePer100g(dto.pricePer100g());
        p.setStockGrams(dto.stockGrams());
        p.setCategory(category);
        p.setFeatured(dto.featured());

        return toDTO(productRepo.save(p));
    }

    // DELETE PRODUCT
    @Transactional
    public void delete(Long id) {
        User florist = userService.getCurrentUser();
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new com.example.backend.exception.ResourceNotFoundException("Product not found with id: " + id));
        if (!p.getFlorist().getId().equals(florist.getId())) {
            throw new RuntimeException("Not owner");
        }
        productRepo.delete(p);
    }

    // GET PRODUCT BY ID
    public ProductResponseDTO getById(Long id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new com.example.backend.exception.ResourceNotFoundException("Product not found with id: " + id));
        return toDTO(p);
    }

    // LIST PRODUCTS
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> list(String q, String categoryName, Double minPrice, Double maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Specification<Product> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (q != null && !q.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + q.trim().toLowerCase() + "%"));
            }
            if (categoryName != null && !categoryName.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category").get("name")), categoryName.trim().toLowerCase()));
            }
            if (minPrice != null) predicates.add(cb.greaterThanOrEqualTo(root.get("pricePer100g"), minPrice));
            if (maxPrice != null) predicates.add(cb.lessThanOrEqualTo(root.get("pricePer100g"), maxPrice));

            return cb.and(predicates.toArray(new Predicate[predicates.size()]));
        };

        return productRepo.findAll(spec, pageable).map(this::toDTO);
    }

    // GET FEATURED PRODUCTS
    public List<ProductResponseDTO> getFeaturedProducts(Integer limit) {
        List<Product> featured = productRepo.findByActiveTrueAndFeaturedTrue()
                .stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .collect(Collectors.toList());

        if (limit != null && limit > 0 && featured.size() > limit) {
            featured = featured.subList(0, limit);
        }
        return featured.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // GET PRODUCTS BY FLORIST
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findByFlorist(User florist) {
        return productRepo.findByFlorist(florist)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // HELPER: resolve category dynamically
    private Category resolveCategory(ProductCreateDTO dto) {
        if (dto.newCategoryName() != null && !dto.newCategoryName().isBlank()) {
            return categoryRepo.findByName(dto.newCategoryName().trim())
                    .orElseGet(() -> {
                        Category newCat = new Category();
                        newCat.setName(dto.newCategoryName().trim());
                        return categoryRepo.save(newCat);
                    });
        } else if (dto.categoryId() != null) {
            return categoryRepo.findById(dto.categoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        } else {
            throw new RuntimeException("Category or newCategoryName must be provided");
        }
    }

    // UPDATE PRODUCT - PARTIAL UPDATE FOR PRICE AND QUANTITY ONLY
    @Transactional
    public ProductResponseDTO updatePriceAndQuantity(Long id, Double pricePer100g, Integer stockGrams) {
        User florist = userService.getCurrentUser();
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new com.example.backend.exception.ResourceNotFoundException("Product not found with id: " + id));

        if (!p.getFlorist().getId().equals(florist.getId())) {
            throw new RuntimeException("Not owner");
        }

        p.setPricePer100g(pricePer100g);
        p.setStockGrams(stockGrams);

        return toDTO(productRepo.save(p));
    }

    // HELPER: Convert Product to DTO
    private ProductResponseDTO toDTO(Product p) {
        Double averageRating = reviewService.getAverageRating(p.getId());
        Long reviewCount = reviewService.getReviewCount(p.getId());
        
        return new ProductResponseDTO(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getImageUrl(),
                p.getPricePer100g(),
                p.getStockGrams(),
                p.getCategory() != null ? p.getCategory().getId() : null,
                p.getCategory() != null ? p.getCategory().getName() : null,
                p.getFlorist().getId(),
                p.getFlorist().getName(),
                p.getFeatured(),
                averageRating != null ? averageRating : 0.0,
                reviewCount
        );
    }
}

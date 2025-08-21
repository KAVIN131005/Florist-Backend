package com.example.backend.service;

import com.example.backend.model.Category;
import com.example. backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class CategoryService {
  private final CategoryRepository categoryRepo;

  public Category getOrCreate(String name, String desc) {
    return categoryRepo.findByNameIgnoreCase(name)
        .orElseGet(() -> categoryRepo.save(Category.builder().name(name).description(desc).build()));
  }

  public List<Category> all() { return categoryRepo.findAll(); }
}

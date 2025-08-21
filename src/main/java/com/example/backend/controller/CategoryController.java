package com.example.backend.controller;

import com.example.backend.model.Category;
import com.example. backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/categories") @RequiredArgsConstructor
public class CategoryController {
  private final CategoryService categoryService;

  @GetMapping
  public List<Category> all() { return categoryService.all(); }

  @PostMapping
  public Category create(@RequestParam String name, @RequestParam(required=false) String description) {
    return categoryService.getOrCreate(name, description);
  }
}

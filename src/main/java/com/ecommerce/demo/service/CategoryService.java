package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Category;
import com.ecommerce.demo.repository.CategoryRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Optional<Category> updateCategory(Long id, Category categoryDetails) {
        return categoryRepository.findById(id)
                .map(existing -> {
                    if (categoryDetails.getCategoryName() != null) {
                        existing.setCategoryName(categoryDetails.getCategoryName());
                    }
                    if (categoryDetails.getDescription() != null) {
                        existing.setDescription(categoryDetails.getDescription());
                    }
                    return categoryRepository.save(existing);
                });
    }

    public boolean deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            try {
                categoryRepository.deleteById(id);
                return true;
            } catch (DataIntegrityViolationException e) {
                return false;
            }
        }
        return false;
    }
}
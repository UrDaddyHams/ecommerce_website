package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Product;
import com.ecommerce.demo.repository.ProductRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Transactional
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Optional<Product> updateProduct(Long id, Product productDetails) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    if (productDetails.getProductName() != null) {
                        existingProduct.setProductName(productDetails.getProductName());
                    }
                    if (productDetails.getPrice() != null) {
                        existingProduct.setPrice(productDetails.getPrice());
                    }
                    if (productDetails.getStock() != null) {
                        existingProduct.setStock(productDetails.getStock());
                    }
                    if (productDetails.getDescription() != null) {
                        existingProduct.setDescription(productDetails.getDescription());
                    }
                    if (productDetails.getIdCategory() != null) {
                        existingProduct.setIdCategory(productDetails.getIdCategory());
                    }
                    if (productDetails.getIdSupplier() != null) {
                        existingProduct.setIdSupplier(productDetails.getIdSupplier());
                    }
                    return productRepository.save(existingProduct);
                });
    }

    @Transactional
    public boolean updateStock(Long id, Integer quantity) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setStock(quantity);
                    productRepository.save(product);
                    return true;
                })
                .orElse(false);
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            return false;
        }
        try {
            productRepository.deleteById(id);
            return true;
        } catch (DataIntegrityViolationException e) {

            return false;
        }
    }
}
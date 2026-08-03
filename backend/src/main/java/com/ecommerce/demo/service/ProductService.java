package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Product;
import com.ecommerce.demo.repository.ProductRepository;
import com.ecommerce.demo.repository.CartItemRepository;
import com.ecommerce.demo.repository.OrderItemRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

    public ProductService(ProductRepository productRepository,
                          CartItemRepository cartItemRepository,
                          OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Page<Product> getAllProductsPaginated(Pageable pageable) {
        return productRepository.findAll(pageable);
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
            // 1. Clear dependent cart items
            cartItemRepository.deleteByProductIdProduct(id);

            // 2. Clear dependent order items
            orderItemRepository.deleteByProductIdProduct(id);

            // 3. Delete the product safely
            productRepository.deleteById(id);
            productRepository.flush();
            return true;
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Cannot delete this product because it is tied to protected system records.");
        }
    }
}
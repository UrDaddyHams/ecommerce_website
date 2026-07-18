package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Product;
import com.ecommerce.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;
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

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public boolean updateStock(Long idProduct, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(idProduct);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();

            // This line now perfectly matches your model's setter!
            product.setStock(quantity);

            productRepository.save(product);
            return true;
        }
        return false;
    }
}
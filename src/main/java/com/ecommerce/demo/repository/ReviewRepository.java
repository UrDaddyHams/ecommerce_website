package com.ecommerce.demo.repository;

import com.ecommerce.demo.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByIdProduct(Long idProduct);
    List<Review> findByIdCustomer(Long idCustomer);
}
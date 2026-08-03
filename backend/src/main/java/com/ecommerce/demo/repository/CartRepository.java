package com.ecommerce.demo.repository;

import com.ecommerce.demo.model.Cart;
import com.ecommerce.demo.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByIdCustomer(Long idCustomer);
    Optional<Cart> findByCustomer(Customer customer);

}
package com.ecommerce.demo.repository;

import com.ecommerce.demo.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Spring Data JPA drills into Cart -> idCart automatically
    List<CartItem> findByCart_IdCart(Long idCart);

}
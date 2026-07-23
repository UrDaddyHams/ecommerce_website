package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Cart;
import com.ecommerce.demo.repository.CartRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public Optional<Cart> getCartById(Long id) {
        return cartRepository.findById(id);
    }

    @Transactional
    public Cart saveCart(Cart cart) {
        return cartRepository.save(cart);
    }

    @Transactional
    public Optional<Cart> updateCart(Long id, Cart cartDetails) {
        return cartRepository.findById(id)
                .map(existingCart -> {
                    if (cartDetails.getCreatedDate() != null) {
                        existingCart.setCreatedDate(cartDetails.getCreatedDate());
                    }
                    if (cartDetails.getIdCustomer() != null) {
                        existingCart.setIdCustomer(cartDetails.getIdCustomer());
                    }
                    return cartRepository.save(existingCart);
                });
    }

    @Transactional
    public boolean deleteCart(Long id) {
        if (!cartRepository.existsById(id)) {
            return false;
        }
        try {
            cartRepository.deleteById(id);
            return true;
        } catch (DataIntegrityViolationException e) {

            return false;
        }
    }
}
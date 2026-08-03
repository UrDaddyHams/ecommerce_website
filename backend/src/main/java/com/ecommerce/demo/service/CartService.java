package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Cart;
import com.ecommerce.demo.model.Customer;
import com.ecommerce.demo.repository.CartRepository;
import com.ecommerce.demo.repository.CustomerRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CustomerRepository customerRepository; // <--- 1. Declare it here

    public CartService(CartRepository cartRepository, CustomerRepository customerRepository) { // <--- 2. Add it to the constructor
        this.cartRepository = cartRepository;
        this.customerRepository = customerRepository; // <--- 3. Assign it here
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
                    if (cartDetails.getCustomer() != null) {
                        existingCart.setCustomer(cartDetails.getCustomer());
                    }
                    return cartRepository.save(existingCart);
                });
    }

    public Cart getOrCreateCartByUsername(String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found for username: " + username));

        return cartRepository.findByCustomer(customer)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer); // Make sure this is fully populated and non-null
                    newCart.setCreatedDate(LocalDateTime.now());
                    return cartRepository.save(newCart);
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
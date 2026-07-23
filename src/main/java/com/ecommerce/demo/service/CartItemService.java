package com.ecommerce.demo.service;

import com.ecommerce.demo.dto.CartItemRequest;
import com.ecommerce.demo.model.Cart;
import com.ecommerce.demo.model.CartItem;
import com.ecommerce.demo.model.Product;
import com.ecommerce.demo.repository.CartItemRepository;
import com.ecommerce.demo.repository.CartRepository;
import com.ecommerce.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartItemService(CartItemRepository cartItemRepository,
                           CartRepository cartRepository,
                           ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getItemsByCartId(Long cartId) {
        if (cartId == null) {
            throw new IllegalArgumentException("Cart ID must not be null");
        }
        return cartItemRepository.findByCart_IdCart(cartId);
    }

    @Transactional
    public CartItem addItemToCart(CartItemRequest request) {
        // Prevent Spring Data JPA's findById(null) crash by validating early
        if (request == null) {
            throw new IllegalArgumentException("CartItemRequest body cannot be null");
        }
        if (request.getIdCart() == null) {
            throw new IllegalArgumentException("id_cart must not be null");
        }
        if (request.getIdProduct() == null) {
            throw new IllegalArgumentException("id_product must not be null");
        }

        Cart cart = cartRepository.findById(request.getIdCart())
                .orElseThrow(() -> new IllegalArgumentException("Cart not found with id: " + request.getIdCart()));

        Product product = productRepository.findById(request.getIdProduct())
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + request.getIdProduct()));

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(request.getQuantity());

        return cartItemRepository.save(item);
    }

    @Transactional
    public Optional<CartItem> updateCartItem(Long id, CartItemRequest request) {
        if (id == null) {
            throw new IllegalArgumentException("Cart item ID must not be null");
        }
        return cartItemRepository.findById(id)
                .map(existingItem -> {
                    if (request.getQuantity() != null) {
                        existingItem.setQuantity(request.getQuantity());
                    }
                    return cartItemRepository.save(existingItem);
                });
    }

    @Transactional
    public boolean removeItem(Long idCartItem) {
        if (idCartItem != null && cartItemRepository.existsById(idCartItem)) {
            cartItemRepository.deleteById(idCartItem);
            return true;
        }
        return false;
    }
}
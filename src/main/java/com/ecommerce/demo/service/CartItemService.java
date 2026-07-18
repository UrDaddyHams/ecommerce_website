package com.ecommerce.demo.service;

import com.ecommerce.demo.model.CartItem;
import com.ecommerce.demo.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public List<CartItem> getItemsByCartId(Long idCart) {
        return cartItemRepository.findByIdCart(idCart);
    }

    public CartItem addItemToCart(CartItem item) {
        return cartItemRepository.save(item);
    }

    public void removeItem(Long idCartItem) {
        cartItemRepository.deleteById(idCartItem);
    }
}
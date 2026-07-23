package com.ecommerce.demo.controller;

import com.ecommerce.demo.dto.CartItemRequest;
import com.ecommerce.demo.model.CartItem;
import com.ecommerce.demo.service.CartItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @GetMapping("/cart/{idCart}")
    public List<CartItem> getItemsByCart(@PathVariable Long idCart) {
        return cartItemService.getItemsByCartId(idCart);
    }

    @PostMapping
    public ResponseEntity<CartItem> addItemToCart(@RequestBody CartItemRequest request) {
        // Change getUserId() -> request.getIdCart()
        // Change getProductId() -> request.getIdProduct()
        CartItem newItem = cartItemService.addItemToCart(request);
        return ResponseEntity.ok(newItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long id, @RequestBody CartItemRequest request) {
        return cartItemService.updateCartItem(id, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id) {
        if (cartItemService.removeItem(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
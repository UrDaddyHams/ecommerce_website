package com.ecommerce.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CartItemRequest {

    @JsonProperty("id_cart")
    private Long idCart;

    @JsonProperty("id_product")
    private Long idProduct;

    private Integer quantity;

    public CartItemRequest() {}

    public CartItemRequest(Long idCart, Long idProduct, Integer quantity) {
        this.idCart = idCart;
        this.idProduct = idProduct;
        this.quantity = quantity;
    }

    public Long getIdCart() { return idCart; }
    public void setIdCart(Long idCart) { this.idCart = idCart; }

    public Long getIdProduct() { return idProduct; }
    public void setIdProduct(Long idProduct) { this.idProduct = idProduct; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
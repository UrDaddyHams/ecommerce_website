package com.ecommerce.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_item")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cart_item")
    private Long idCartItem;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "id_cart")
    private Long idCart;

    @Column(name = "id_product")
    private Long idProduct;

    public CartItem() {}

    public CartItem(Integer quantity, Long idCart, Long idProduct) {
        this.quantity = quantity;
        this.idCart = idCart;
        this.idProduct = idProduct;
    }

    public Long getIdCartItem() { return idCartItem; }
    public void setIdCartItem(Long idCartItem) { this.idCartItem = idCartItem; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Long getIdCart() { return idCart; }
    public void setIdCart(Long idCart) { this.idCart = idCart; }

    public Long getIdProduct() { return idProduct; }
    public void setIdProduct(Long idProduct) { this.idProduct = idProduct; }
}
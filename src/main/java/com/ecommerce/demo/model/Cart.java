package com.ecommerce.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cart")
    private Long idCart;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "id_customer")
    private Long idCustomer;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    public Cart() {}

    public Cart(LocalDateTime createdDate, Long idCustomer) {
        this.createdDate = createdDate;
        this.idCustomer = idCustomer;
    }

    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }

    // Getters and Setters
    public Long getIdCart() { return idCart; }
    public void setIdCart(Long idCart) { this.idCart = idCart; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public Long getIdCustomer() { return idCustomer; }
    public void setIdCustomer(Long idCustomer) { this.idCustomer = idCustomer; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }
}
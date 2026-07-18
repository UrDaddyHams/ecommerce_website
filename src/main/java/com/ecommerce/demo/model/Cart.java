package com.ecommerce.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

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

    public Cart() {}

    public Cart(LocalDateTime createdDate, Long idCustomer) {
        this.createdDate = createdDate;
        this.idCustomer = idCustomer;
    }

    public Long getIdCart() { return idCart; }
    public void setIdCart(Long idCart) { this.idCart = idCart; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public Long getIdCustomer() { return idCustomer; }
    public void setIdCustomer(Long idCustomer) { this.idCustomer = idCustomer; }
}
package com.ecommerce.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order_item")
    private Long idOrderItem;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Double price;

    @Column(name = "id_order")
    private Long idOrder;

    @Column(name = "id_product")
    private Long idProduct;

    public OrderItem() {}

    public OrderItem(Integer quantity, Double price, Long idOrder, Long idProduct) {
        this.quantity = quantity;
        this.price = price;
        this.idOrder = idOrder;
        this.idProduct = idProduct;
    }

    public Long getIdOrderItem() { return idOrderItem; }
    public void setIdOrderItem(Long idOrderItem) { this.idOrderItem = idOrderItem; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Long getIdOrder() { return idOrder; }
    public void setIdOrder(Long idOrder) { this.idOrder = idOrder; }

    public Long getIdProduct() { return idProduct; }
    public void setIdProduct(Long idProduct) { this.idProduct = idProduct; }
}
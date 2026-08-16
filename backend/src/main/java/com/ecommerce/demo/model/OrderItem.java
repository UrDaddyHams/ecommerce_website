package com.ecommerce.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(name = "id_order", insertable = false, updatable = false)
    private Long idOrder;

    @Column(name = "id_product", insertable = false, updatable = false)
    private Long idProduct;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_order")
    @JsonIgnore
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_product")
    private Product product;

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

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
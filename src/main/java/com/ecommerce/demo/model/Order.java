package com.ecommerce.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_table") // 'order' is a reserved keyword in SQL
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order")
    private Long idOrder;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "status")
    private String status;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "id_customer")
    private Long idCustomer;

    @Column(name = "id_address")
    private Long idAddress;

    public Order() {}

    public Order(LocalDateTime orderDate, String status, Double totalAmount, Long idCustomer, Long idAddress) {
        this.orderDate = orderDate;
        this.status = status;
        this.totalAmount = totalAmount;
        this.idCustomer = idCustomer;
        this.idAddress = idAddress;
    }

    public Long getIdOrder() { return idOrder; }
    public void setIdOrder(Long idOrder) { this.idOrder = idOrder; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Long getIdCustomer() { return idCustomer; }
    public void setIdCustomer(Long idCustomer) { this.idCustomer = idCustomer; }

    public Long getIdAddress() { return idAddress; }
    public void setIdAddress(Long idAddress) { this.idAddress = idAddress; }
}
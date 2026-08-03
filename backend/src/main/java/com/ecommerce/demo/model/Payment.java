package com.ecommerce.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_payment")
    private Long idPayment;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "status")
    private String status;

    // Use a single mapping for the foreign key column
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_order", nullable = false)
    private Order order;

    // Helper getter so Jackson/Swagger can read 'idOrder' in JSON responses
    @Transient
    @JsonProperty("idOrder")
    public Long getIdOrder() {
        return order != null ? order.getIdOrder() : null;
    }

    public Payment() {}

    public Payment(String paymentMethod, LocalDateTime paymentDate, Double amount, String status, Order order) {
        this.paymentMethod = paymentMethod;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.status = status;
        this.order = order;
    }

    public Long getIdPayment() { return idPayment; }
    public void setIdPayment(Long idPayment) { this.idPayment = idPayment; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}
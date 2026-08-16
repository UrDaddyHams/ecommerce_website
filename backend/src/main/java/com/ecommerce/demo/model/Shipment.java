package com.ecommerce.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipment")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_shipment")
    private Long idShipment;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipping_date")
    private LocalDateTime shippingDate;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Column(name = "status")
    private String status;

    @Column(name = "id_order", insertable = false, updatable = false)
    private Long idOrder;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_order")
    private Order order;

    public Shipment() {}

    public Shipment(String trackingNumber, LocalDateTime shippingDate, LocalDateTime deliveryDate, String status, Long idOrder) {
        this.trackingNumber = trackingNumber;
        this.shippingDate = shippingDate;
        this.deliveryDate = deliveryDate;
        this.status = status;
        this.idOrder = idOrder;
    }

    public Long getIdShipment() { return idShipment; }
    public void setIdShipment(Long idShipment) { this.idShipment = idShipment; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public LocalDateTime getShippingDate() { return shippingDate; }
    public void setShippingDate(LocalDateTime shippingDate) { this.shippingDate = shippingDate; }

    public LocalDateTime getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDateTime deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getIdOrder() { return idOrder; }
    public void setIdOrder(Long idOrder) { this.idOrder = idOrder; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    @Transient
    @JsonProperty("productName")
    public String getProductName() {
        if (order != null && order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            var firstItem = order.getOrderItems().get(0);
            if (firstItem.getProduct() != null) {
                return firstItem.getProduct().getProductName(); // Uses the correct getProductName() method
            }
        }
        return "Book Item";
    }

}
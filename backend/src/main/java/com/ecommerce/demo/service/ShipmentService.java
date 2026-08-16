package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Shipment;
import com.ecommerce.demo.repository.ShipmentRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    @Transactional(readOnly = true)
    public List<Shipment> getAllShipments() {
        List<Shipment> shipments = shipmentRepository.findAllWithOrder();
        initializeOrderItems(shipments);
        return shipments;
    }

    @Transactional(readOnly = true)
    public Optional<Shipment> getShipmentById(Long id) {
        Optional<Shipment> shipment = shipmentRepository.findById(id);
        shipment.ifPresent(s -> initializeSingleShipment(s));
        return shipment;
    }

    @Transactional(readOnly = true)
    public Optional<Shipment> getShipmentByOrderId(Long idOrder) {
        Optional<Shipment> shipment = shipmentRepository.findByIdOrder(idOrder);
        shipment.ifPresent(s -> initializeSingleShipment(s));
        return shipment;
    }

    @Transactional(readOnly = true)
    public List<Shipment> getShipmentsByUserId(Long userId) {
        List<Shipment> shipments = shipmentRepository.findByOrder_Customer_IdCustomer(userId);
        initializeOrderItems(shipments);
        return shipments;
    }

    @Transactional
    public Shipment saveShipment(Shipment shipment) {
        if (shipment.getShippingDate() == null) {
            shipment.setShippingDate(LocalDateTime.now());
        }
        return shipmentRepository.save(shipment);
    }

    @Transactional
    public Optional<Shipment> updateShipment(Long id, Shipment shipmentDetails) {
        return shipmentRepository.findById(id)
                .map(existing -> {
                    if (shipmentDetails.getTrackingNumber() != null) {
                        existing.setTrackingNumber(shipmentDetails.getTrackingNumber());
                    }
                    if (shipmentDetails.getShippingDate() != null) {
                        existing.setShippingDate(shipmentDetails.getShippingDate());
                    }
                    if (shipmentDetails.getDeliveryDate() != null) {
                        existing.setDeliveryDate(shipmentDetails.getDeliveryDate());
                    }
                    if (shipmentDetails.getStatus() != null) {
                        existing.setStatus(shipmentDetails.getStatus());
                    }
                    if (shipmentDetails.getIdOrder() != null) {
                        existing.setIdOrder(shipmentDetails.getIdOrder());
                    }
                    return shipmentRepository.save(existing);
                });
    }

    @Transactional
    public boolean deleteShipment(Long id) {
        if (shipmentRepository.existsById(id)) {
            try {
                shipmentRepository.deleteById(id);
                return true;
            } catch (DataIntegrityViolationException e) {
                return false;
            }
        }
        return false;
    }

    // Helper methods to force Hibernate to initialize collections while transaction is active
    private void initializeOrderItems(List<Shipment> shipments) {
        for (Shipment shipment : shipments) {
            initializeSingleShipment(shipment);
        }
    }

    private void initializeSingleShipment(Shipment shipment) {
        if (shipment.getOrder() != null && shipment.getOrder().getOrderItems() != null) {
            // Accessing size() forces Hibernate to load all items from the database
            shipment.getOrder().getOrderItems().size();
            for (var item : shipment.getOrder().getOrderItems()) {
                if (item.getProduct() != null) {
                    item.getProduct().getProductName(); // Forces product details to load
                }
            }
        }
    }
}
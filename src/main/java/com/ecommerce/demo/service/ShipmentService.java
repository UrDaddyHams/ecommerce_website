package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Shipment;
import com.ecommerce.demo.repository.ShipmentRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public Optional<Shipment> getShipmentById(Long id) {
        return shipmentRepository.findById(id);
    }

    public Optional<Shipment> getShipmentByOrderId(Long idOrder) {
        return shipmentRepository.findByIdOrder(idOrder);
    }

    public Shipment saveShipment(Shipment shipment) {
        if (shipment.getShippingDate() == null) {
            shipment.setShippingDate(LocalDateTime.now());
        }
        return shipmentRepository.save(shipment);
    }

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
}
package com.ecommerce.demo.repository;

import com.ecommerce.demo.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByIdOrder(Long idOrder);

    // Correct path traversal: Shipment -> Order -> Customer -> idCustomer
    List<Shipment> findByOrder_Customer_IdCustomer(Long customerId);
}
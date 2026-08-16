package com.ecommerce.demo.repository;

import com.ecommerce.demo.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    @Query("SELECT s FROM Shipment s WHERE s.order.idOrder = :idOrder")
    Optional<Shipment> findByIdOrder(@Param("idOrder") Long idOrder);

    @Query("SELECT s FROM Shipment s JOIN FETCH s.order o WHERE o.customer.idCustomer = :customerId")
    List<Shipment> findByOrder_Customer_IdCustomer(@Param("customerId") Long customerId);

    @Query("SELECT s FROM Shipment s JOIN FETCH s.order o")
    List<Shipment> findAllWithOrder();
}
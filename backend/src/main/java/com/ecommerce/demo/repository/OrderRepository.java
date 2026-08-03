package com.ecommerce.demo.repository;

import com.ecommerce.demo.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Traverse through the 'customer' relationship object to reach 'idCustomer'
    List<Order> findByCustomer_IdCustomer(Long idCustomer);
}
package com.ecommerce.demo.repository;

import com.ecommerce.demo.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByIdCustomer(Long idCustomer);
}
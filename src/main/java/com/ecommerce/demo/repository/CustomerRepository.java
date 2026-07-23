package com.ecommerce.demo.repository;

import com.ecommerce.demo.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> { //jpaRepository gives u access to methods like .save(), findAll(), .deleteByAll(), .count() without writing any implementation code for it
                                                                            //Customer is the entity type, Long is the primary key type
    Optional<Customer> findByEmail(String email);//runs select * from customers where email = wtv u enter
    boolean existsByEmail(String email); //runs select count(*) > 0 from customers where email = wtv u enter
}
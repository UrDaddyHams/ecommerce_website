package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Customer;
import com.ecommerce.demo.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


//serves as the middle man bw api endpoints and database
// data ko verify aur wrap karta hai

//registers this class as a bean managed by spring
@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    //container object for methods that might not find a match so it prevents null pointer exception crashes
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer registerCustomer(Customer customer) {
        // business logic rule: profile defaults could go here
        return customerRepository.save(customer);
    }

    public java.util.Optional<Customer> updateCustomer(Long id, Customer customerDetails) {
        return customerRepository.findById(id)
                .map(existingCustomer -> {  //.map means inside update, it fetches the existing entity, overwrites its fields with the incoming details and saves it back to mysql
                    existingCustomer.setFirstName(customerDetails.getFirstName());
                    existingCustomer.setLastName(customerDetails.getLastName());
                    existingCustomer.setEmail(customerDetails.getEmail());
                    existingCustomer.setPhone(customerDetails.getPhone());
                    if (customerDetails.getPassword() != null) {
                        existingCustomer.setPassword(customerDetails.getPassword());
                    }
                    return customerRepository.save(existingCustomer);
                });
    }

    public boolean deleteCustomer(Long id) {
        //exists by id means it checks if a row exists in MySQL prior to deletion, this prevents db to throw errors if user enters invalid id
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
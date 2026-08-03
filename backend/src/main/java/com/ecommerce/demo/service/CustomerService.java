package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Address;
import com.ecommerce.demo.model.Customer;
import com.ecommerce.demo.repository.AddressRepository;
import com.ecommerce.demo.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;

    public CustomerService(CustomerRepository customerRepository, AddressRepository addressRepository) {
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer registerCustomer(Customer customer) {
        // Ensure every incoming address links back to this customer entity
        // so JPA cascades the foreign key properly upon saving.
        if (customer.getAddresses() != null && !customer.getAddresses().isEmpty()) {
            for (Address address : customer.getAddresses()) {
                address.setCustomer(customer);
            }
        }

        // Because of CascadeType.ALL on Customer.addresses, saving the customer
        // will automatically insert the addresses into the database table.
        return customerRepository.save(customer);
    }

    public Optional<Customer> updateCustomer(Long id, Customer customerDetails) {
        return customerRepository.findById(id)
                .map(existingCustomer -> {
                    existingCustomer.setFirstName(customerDetails.getFirstName());
                    existingCustomer.setLastName(customerDetails.getLastName());
                    existingCustomer.setEmail(customerDetails.getEmail());
                    existingCustomer.setPhone(customerDetails.getPhone());
                    if (customerDetails.getPassword() != null) {
                        existingCustomer.setPassword(customerDetails.getPassword());
                    }

                    // Handle updating/replacing addresses safely
                    if (customerDetails.getAddresses() != null) {
                        existingCustomer.getAddresses().clear();
                        for (Address address : customerDetails.getAddresses()) {
                            address.setCustomer(existingCustomer);
                            existingCustomer.getAddresses().add(address);
                        }
                    }

                    return customerRepository.save(existingCustomer);
                });
    }

    public boolean deleteCustomer(Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
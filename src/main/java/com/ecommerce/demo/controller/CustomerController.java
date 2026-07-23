package com.ecommerce.demo.controller;
//controller exposes ur application to the outside world. it maps http paths(eg. /api/cusomers) to specific methods, parses incoming json payloads and returns http responses(200 OK, 200 created, 404 not found)
import com.ecommerce.demo.model.Customer;
import com.ecommerce.demo.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// restcontroller tells spring to serialisze returned java objects directly into json format for http responses
@RestController
//requestmapping sets the base url path for all end points in this class
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) { //@pathvairable extracts dynamic parameters directly from the url path(like extracting 26 from /api/customers/26)
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok) //returns 200 ok  with a body
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    //@postmapping represesnts the full http response allowing control over both the return body and the http status code (200 ok, 201 create, 404 not found)
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) { //@requestbody reads the raw json body sent in postman and converts it into a java object
        Customer savedCustomer = customerService.registerCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer); //201 created with a body
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        return customerService.updateCustomer(id, customerDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {   //deleteCustomer is a method in CustomerService class
        if (customerService.deleteCustomer(id)) {
            return ResponseEntity.noContent().build();  //204 no content(for successful deletion)
        }
        return ResponseEntity.notFound().build(); //badrequest
    }
}
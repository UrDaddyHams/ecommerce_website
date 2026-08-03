package com.ecommerce.demo.controller;

import com.ecommerce.demo.model.Customer;
import com.ecommerce.demo.model.Order;
import com.ecommerce.demo.model.Payment;
import com.ecommerce.demo.repository.AddressRepository;
import com.ecommerce.demo.repository.CustomerRepository;
import com.ecommerce.demo.service.CheckoutService;
import com.ecommerce.demo.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final CustomerRepository customerRepository;
    private final PaymentService paymentService;
    private final AddressRepository addressRepository;

    public CheckoutController(CheckoutService checkoutService,
                              CustomerRepository customerRepository,
                              PaymentService paymentService,
                              AddressRepository addressRepository) {
        this.checkoutService = checkoutService;
        this.customerRepository = customerRepository;
        this.paymentService = paymentService;
        this.addressRepository = addressRepository;
    }

    @PostMapping("/{customerId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN') or hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> checkout(
            @PathVariable Long customerId,
            @RequestBody(required = false) Map<String, String> requestBody) {
        try {
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            // 🛑 VALIDATION CHECK: Ignore placeholder strings like "Not Provided" or "00000"
            boolean hasValidAddress = addressRepository.findByCustomer_IdCustomer(customerId).stream()
                    .anyMatch(addr ->
                            addr.getStreet() != null && !addr.getStreet().equalsIgnoreCase("Not Provided") &&
                                    addr.getCity() != null && !addr.getCity().equalsIgnoreCase("Not Provided") &&
                                    addr.getPostalCode() != null && !addr.getPostalCode().equals("00000")
                    );

            if (!hasValidAddress) {
                return ResponseEntity.badRequest().body("Cannot place order: No valid delivery address found. Please update your profile.");
            }

            Order completedOrder = checkoutService.processCheckout(customerId);

            String paymentMethod = (requestBody != null && requestBody.containsKey("paymentMethod"))
                    ? requestBody.get("paymentMethod")
                    : "Credit Card";

            createPaymentForOrder(completedOrder, paymentMethod);

            return ResponseEntity.status(HttpStatus.CREATED).body(completedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/username/{username}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN') or hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> checkoutByUsername(
            @PathVariable String username,
            @RequestParam(required = false, defaultValue = "Credit Card") String paymentMethod) {
        try {
            Customer customer = customerRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Long customerId = customer.getIdCustomer();

            // 🛑 VALIDATION CHECK: Ignore placeholder strings like "Not Provided" or "00000"
            boolean hasValidAddress = addressRepository.findByCustomer_IdCustomer(customerId).stream()
                    .anyMatch(addr ->
                            addr.getStreet() != null && !addr.getStreet().equalsIgnoreCase("Not Provided") &&
                                    addr.getCity() != null && !addr.getCity().equalsIgnoreCase("Not Provided") &&
                                    addr.getPostalCode() != null && !addr.getPostalCode().equals("00000")
                    );

            if (!hasValidAddress) {
                return ResponseEntity.badRequest().body("Cannot place order: No valid delivery address found. Please update your profile.");
            }

            Order completedOrder = checkoutService.processCheckoutByUsername(username);
            createPaymentForOrder(completedOrder, paymentMethod);

            return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Map.of("message", "Checkout successful!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private void createPaymentForOrder(Order order, String paymentMethod) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus("COMPLETED");
        paymentService.processPayment(payment);
    }
}
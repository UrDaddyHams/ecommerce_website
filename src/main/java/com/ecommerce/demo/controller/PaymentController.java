package com.ecommerce.demo.controller;

import com.ecommerce.demo.model.Payment;
import com.ecommerce.demo.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<Payment> processPayment(@RequestBody Payment payment) {
        Payment processedPayment = paymentService.processPayment(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(processedPayment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/order/{idOrder}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Long idOrder) {
        return paymentService.getPaymentByOrderId(idOrder)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @RequestBody Payment paymentDetails) {
        return paymentService.updatePayment(id, paymentDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
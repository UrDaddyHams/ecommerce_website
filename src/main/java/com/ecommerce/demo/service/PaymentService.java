package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Payment;
import com.ecommerce.demo.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment processPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public Optional<Payment> getPaymentByOrderId(Long idOrder) {
        return paymentRepository.findByIdOrder(idOrder);
    }

    public Optional<Payment> updatePayment(Long id, Payment paymentDetails) {
        return paymentRepository.findById(id)
                .map(existingPayment -> {
                    if (paymentDetails.getStatus() != null) {
                        existingPayment.setStatus(paymentDetails.getStatus());
                    }
                    if (paymentDetails.getAmount() != null) {
                        existingPayment.setAmount(paymentDetails.getAmount());
                    }
                    if (paymentDetails.getPaymentMethod() != null) {
                        existingPayment.setPaymentMethod(paymentDetails.getPaymentMethod());
                    }
                    return paymentRepository.save(existingPayment);
                });
    }
}
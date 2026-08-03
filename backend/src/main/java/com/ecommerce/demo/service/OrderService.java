package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Customer;
import com.ecommerce.demo.model.Order;
import com.ecommerce.demo.repository.CustomerRepository;
import com.ecommerce.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    public OrderService(OrderRepository orderRepository, CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
    }

    public List<Order> getOrdersByCustomer(Long idCustomer) {
        return orderRepository.findByCustomer_IdCustomer(idCustomer);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order placeOrder(Order order) {
        // Fallback: If customer isn't fully attached, try to extract from order fields or throw
        if (order.getCustomer() == null || order.getCustomer().getIdCustomer() == null) {
            if (order.getIdCustomer() != null) {
                Customer fallbackCustomer = customerRepository.findById(order.getIdCustomer())
                        .orElseThrow(() -> new RuntimeException("Customer not found"));
                order.setCustomer(fallbackCustomer);
            } else {
                throw new IllegalArgumentException("Order must be associated with a valid customer.");
            }
        }

        Long customerId = order.getCustomer().getIdCustomer();
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // 🛑 MANDATORY BACKEND CHECK: Blocks checkout if address list is empty/null
        if (customer.getAddresses() == null || customer.getAddresses().isEmpty()) {
            throw new IllegalStateException("Cannot place order: No delivery address found for this customer.");
        }

        return orderRepository.save(order);
    }

    public Optional<Order> updateOrder(Long id, Order orderDetails) {
        return orderRepository.findById(id)
                .map(existingOrder -> {
                    existingOrder.setStatus(orderDetails.getStatus());
                    return orderRepository.save(existingOrder);
                });
    }
}
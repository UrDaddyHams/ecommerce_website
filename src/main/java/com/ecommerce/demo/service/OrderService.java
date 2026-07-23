package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Order;
import com.ecommerce.demo.repository.CustomerRepository;
import com.ecommerce.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        return orderRepository.findByIdCustomer(idCustomer);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Optional<Order> updateOrder(Long id, Order orderDetails) {
        return orderRepository.findById(id)
                .map(existingOrder -> {
                    if (orderDetails.getStatus() != null) {
                        existingOrder.setStatus(orderDetails.getStatus());
                    }
                    if (orderDetails.getTotalAmount() != null) {
                        existingOrder.setTotalAmount(orderDetails.getTotalAmount());
                    }
                    if (orderDetails.getIdAddress() != null) {
                        existingOrder.setIdAddress(orderDetails.getIdAddress());
                    }
                    if (orderDetails.getIdCustomer() != null) {
                        // Validate before updating customer reference
                        if (!customerRepository.existsById(orderDetails.getIdCustomer())) {
                            throw new IllegalArgumentException("Customer with ID " + orderDetails.getIdCustomer() + " does not exist.");
                        }
                        existingOrder.setIdCustomer(orderDetails.getIdCustomer());
                    }

                    return orderRepository.save(existingOrder);
                });
    }

    public Order placeOrder(Order order) {
        // 2. Check for null id_customer
        if (order.getIdCustomer() == null) {
            throw new IllegalArgumentException("Cannot place order: id_customer is required.");
        }

        // 3. Verify the customer actually exists in the DB
        if (!customerRepository.existsById(order.getIdCustomer())) {
            throw new IllegalArgumentException("Cannot place order: Customer with ID " + order.getIdCustomer() + " does not exist.");
        }

        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }

        order.setStatus("PENDING");
        return orderRepository.save(order);
    }
}
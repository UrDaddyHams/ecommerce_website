package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Order;
import com.ecommerce.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getOrdersByCustomer(Long idCustomer) {
        return orderRepository.findByIdCustomer(idCustomer);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order placeOrder(Order order) {
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }
        // Business logic rule: default status initialization on placement
        order.setStatus("PENDING");
        return orderRepository.save(order);
    }
}
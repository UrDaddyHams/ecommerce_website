package com.ecommerce.demo.service;

import com.ecommerce.demo.model.OrderItem;
import com.ecommerce.demo.repository.OrderItemRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public List<OrderItem> getItemsByOrderId(Long idOrder) {
        return orderItemRepository.findByIdOrder(idOrder);
    }

    public Optional<OrderItem> getOrderItemById(Long id) {
        return orderItemRepository.findById(id);
    }

    public OrderItem saveOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public Optional<OrderItem> updateOrderItem(Long id, OrderItem itemDetails) {
        return orderItemRepository.findById(id)
                .map(existingItem -> {
                    if (itemDetails.getQuantity() != null) {
                        existingItem.setQuantity(itemDetails.getQuantity());
                    }
                    if (itemDetails.getPrice() != null) {
                        existingItem.setPrice(itemDetails.getPrice());
                    }
                    if (itemDetails.getIdOrder() != null) {
                        existingItem.setIdOrder(itemDetails.getIdOrder());
                    }
                    if (itemDetails.getIdProduct() != null) {
                        existingItem.setIdProduct(itemDetails.getIdProduct());
                    }
                    return orderItemRepository.save(existingItem);
                });
    }

    public boolean deleteOrderItem(Long id) {
        if (orderItemRepository.existsById(id)) {
            try {
                orderItemRepository.deleteById(id);
                return true;
            } catch (DataIntegrityViolationException e) {
                return false;
            }
        }
        return false;
    }
}
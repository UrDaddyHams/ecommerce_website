package com.ecommerce.demo.service;

import com.ecommerce.demo.model.*;
import com.ecommerce.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CheckoutService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final ShipmentRepository shipmentRepository;
    private final AddressRepository addressRepository; // <--- 1. Declare AddressRepository

    public CheckoutService(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository,
                           ProductRepository productRepository,
                           CustomerRepository customerRepository,
                           ShipmentRepository shipmentRepository,
                           AddressRepository addressRepository) { // <--- 2. Inject AddressRepository
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.shipmentRepository = shipmentRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional
    public Order processCheckout(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + customerId));

        // 🛑 MANDATORY BACKEND CHECK: Blocks checkout at the service level if no address exists
        boolean hasAddress = !addressRepository.findByCustomer_IdCustomer(customerId).isEmpty();
        if (!hasAddress) {
            throw new RuntimeException("Cannot place order: No delivery address found. Please add an address in your profile.");
        }

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Cart not found for customer ID: " + customerId));

        List<CartItem> cartItems = cart.getItems();
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cannot checkout: Cart is empty!");
        }

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getProductName() +
                        ". Available: " + product.getStock() + ", Requested: " + item.getQuantity());
            }
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItems.add(orderItemRepository.save(orderItem));
        }

        cartItemRepository.deleteAll(cartItems);
        cart.getItems().clear();

        savedOrder.setOrderItems(orderItems);

        Shipment shipment = new Shipment();
        shipment.setOrder(savedOrder);
        shipment.setStatus("PROCESSING");
        shipment.setTrackingNumber("TRK-" + System.currentTimeMillis());
        shipment.setShippingDate(LocalDateTime.now());
        shipment.setDeliveryDate(LocalDateTime.now().plusDays(3));
        shipmentRepository.save(shipment);

        return savedOrder;
    }

    @Transactional
    public Order processCheckoutByUsername(String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found for username: " + username));

        return processCheckout(customer.getIdCustomer());
    }
}
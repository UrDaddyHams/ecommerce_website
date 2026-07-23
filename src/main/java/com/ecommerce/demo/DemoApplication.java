package com.ecommerce.demo;

import com.ecommerce.demo.model.*;
import com.ecommerce.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner seedData(
			CategoryRepository categoryRepo,
			SupplierRepository supplierRepo,
			ProductRepository productRepo,
			CustomerRepository customerRepo,
			AddressRepository addressRepo,
			CartRepository cartRepo,
			CartItemRepository cartItemRepo,
			OrderRepository orderRepo,
			OrderItemRepository orderItemRepo,
			PaymentRepository paymentRepo,
			ShipmentRepository shipmentRepo,
			ReviewRepository reviewRepo
	) {
		return args -> {
			System.out.println("Starting database insertion test...");

		};
	}
}
package com.ecommerce.demo;

import com.ecommerce.demo.model.*;
import com.ecommerce.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import java.time.LocalDateTime;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
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
			System.out.println("Starting database seeding...");

			if (customerRepo.count() == 0) {
				Customer defaultCustomer = new Customer();
				defaultCustomer.setFirstName("hamna");
				defaultCustomer.setLastName("daddy");
				defaultCustomer.setEmail("hamna@mail.com");
				defaultCustomer.setPhone("03348679668");
				defaultCustomer.setPassword("password");
				Customer savedCustomer = customerRepo.save(defaultCustomer);

				Cart cart = new Cart();
				cart.setCustomer(savedCustomer);
				cartRepo.save(cart);
				System.out.println("Seeded Default Customer with ID: " + savedCustomer.getIdCustomer());
			}

			if (categoryRepo.count() == 0) {
				Category category = categoryRepo.save(new Category("stuff", "things that let u do stuff"));
				
				if (productRepo.count() == 0) {
					productRepo.save(new Product("stuff", 69.69, 69, "it does stuff", category.getIdCategory(), null));
					productRepo.save(new Product("more stuff", 67.67, 67, "does different stuff", category.getIdCategory(), null));
					productRepo.save(new Product("even more stuff", 67.76, 68, "does even more stuff", category.getIdCategory(), null));
					System.out.println("bloop default products");
				}
			}
		};
	}
}
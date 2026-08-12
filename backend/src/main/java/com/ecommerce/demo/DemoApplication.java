package com.ecommerce.demo;

import com.ecommerce.demo.model.*;
import com.ecommerce.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

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
					Product p1 = new Product();
					p1.setProductName("stuff");
					p1.setPrice(69.69);
					p1.setStock(69);
					p1.setDescription("it does stuff");
					p1.setImageUrl("https://images.unsplash.com/photo-1544947950-fa07a98d237f");
					p1.setIdCategory(category.getIdCategory());
					productRepo.save(p1);

					Product p2 = new Product();
					p2.setProductName("more stuff");
					p2.setPrice(67.67);
					p2.setStock(67);
					p2.setDescription("does different stuff");
					p2.setImageUrl(null);
					p2.setIdCategory(category.getIdCategory());
					productRepo.save(p2);

					Product p3 = new Product();
					p3.setProductName("even more stuff");
					p3.setPrice(67.76);
					p3.setStock(68);
					p3.setDescription("does even more stuff");
					p3.setImageUrl(null);
					p3.setIdCategory(category.getIdCategory());
					productRepo.save(p3);

					System.out.println("bloop default products");
				}
			}
		};
	}
}
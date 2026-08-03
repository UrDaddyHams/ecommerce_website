package com.ecommerce.demo.controller;

import com.ecommerce.demo.dto.AuthRequest;
import com.ecommerce.demo.dto.AuthResponse;
import com.ecommerce.demo.dto.RegisterRequest;
import com.ecommerce.demo.model.Admin;
import com.ecommerce.demo.model.Customer;
import com.ecommerce.demo.model.User;
import com.ecommerce.demo.repository.AdminRepository;
import com.ecommerce.demo.repository.CustomerRepository;
import com.ecommerce.demo.repository.UserRepository;
import com.ecommerce.demo.security.JwtUtils;
import com.ecommerce.demo.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final CustomerService customerService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          CustomerRepository customerRepository,
                          CustomerService customerService,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.customerService = customerService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Autowired
    private AdminRepository adminRepository; // Inject this in your AuthController

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken!");
        }

        // Force all public registrations to be regular users
        String assignedRole = "ROLE_USER";
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(request.getUsername(), encodedPassword, assignedRole);
        userRepository.save(user);

        Customer customer = new Customer();
        customer.setUsername(request.getUsername());
        customer.setFirstName(request.getFirstName() != null ? request.getFirstName() : request.getUsername());
        customer.setLastName(request.getLastName() != null ? request.getLastName() : "");
        customer.setEmail(request.getEmail() != null ? request.getEmail() : request.getUsername() + "@placeholder.com");
        customer.setPhone(request.getPhone() != null ? request.getPhone() : "");
        customer.setPassword(encodedPassword);

        customerService.registerCustomer(customer);

        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtUtils.generateToken(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        Long customerId = null;
        Long adminId = null;

        if ("ROLE_ADMIN".equals(user.getRole())) {
            Admin admin = adminRepository.findByUsername(request.getUsername()).orElse(null);
            if (admin != null) adminId = admin.getIdAdmin();
        } else {
            Customer customer = customerRepository.findByUsername(request.getUsername()).orElse(null);
            if (customer != null) customerId = customer.getIdCustomer();
        }

        return ResponseEntity.ok(new AuthResponse(token, customerId, adminId, user.getRole()));
    }
}
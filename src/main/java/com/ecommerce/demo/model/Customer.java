package com.ecommerce.demo.model;

import jakarta.persistence.*;

//marks java class as a database entity
@Entity
@Table(name = "customer") //maps the class to a specific table name in mysql
public class Customer {

    @Id //marks the field as a primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //tells mysql to use auto increment for generation id values
    @Column(name = "id_customer") //customizes the database column constraints
    private Long idCustomer;

    @Column(name = "first_name", nullable = false) //nullable = false: generatees not null in sql
    //and name = "first_name" maps camelCase java fields(firstName) to snake_case mysql columns(first_name)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true) //unique= true adds a unique index constraint
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "password", nullable = false)
    private String password;

    public Customer() {}

    public Customer(String firstName, String lastName, String email, String phone, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    public Long getIdCustomer() { return idCustomer; }
    public void setIdCustomer(Long idCustomer) { this.idCustomer = idCustomer; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
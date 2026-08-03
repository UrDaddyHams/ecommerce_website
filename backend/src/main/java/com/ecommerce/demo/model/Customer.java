package com.ecommerce.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;  //Json.Ignore stops the loopy loop fields when converting java objects to json
import jakarta.persistence.*;  // for jpa annotations
import java.util.ArrayList;  //java utility classes to manage lists of items like address order
import java.util.List;

@Entity //marks this as a jpa entity telling hibernate to manage it as a db table
@Table(name = "customer")  //specifies the exact table name in ur Mysql db table
public class Customer {

    @Id  //marks idCustomer as the primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_customer") //maps it to the db column id_customer
    private Long idCustomer;  //hold the id of the customer

    @Column(name = "first_name", nullable = false) //nullable = false enforces a not null constraint
    private String firstName; //stores customers first name

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true) //has to be unique
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "username", unique = true)
    private String username;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)// declares a 1 to many relationshipp (one customer can have many saved adddresses)
    //mappedBy = "customer" points to the customer feild in the child address class that owns the foreign key
    //cascade = CascadeType.ALL makes it so that operations like save or delete in customer automatically occur in child class
    //orphan removal = true deleting an address from this list automatically deletes from db table
    private List<Address> addresses = new ArrayList<>();  //initialises an empty list to avoid null pointer exceptions

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL) //one customer can have many orders
    @JsonIgnore  //prevents json loops when giving data back over rest api
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL) //link to customers shopping cart
    @JsonIgnore
    private List<Cart> carts = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();

    public Customer() {}  //no arg constructor required by jpa to instantiate the object when loadin rows from mysql

    public Customer(String firstName, String lastName, String email, String phone, String password) {  //this one actually needs u to give parameters while instantiating it and then saving to sql
        this.firstName = firstName;  //it does have id cuz mysql generates it automatically
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    //getter setters yk them already

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

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public List<Address> getAddresses() { return addresses; }
    public void setAddresses(List<Address> addresses) { this.addresses = addresses; }

    public List<Order> getOrders() { return orders; }
    public void setOrders(List<Order> orders) { this.orders = orders; }

    public List<Cart> getCarts() { return carts; }
    public void setCarts(List<Cart> carts) { this.carts = carts; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }
}
package com.ecommerce.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "supplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_supplier")
    private Long idSupplier;

    @Column(name = "supplier_name", nullable = false)
    private String supplierName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    public Supplier() {}

    public Supplier(String supplierName, String phone, String email) {
        this.supplierName = supplierName;
        this.phone = phone;
        this.email = email;
    }

    public Long getIdSupplier() { return idSupplier; }
    public void setIdSupplier(Long idSupplier) { this.idSupplier = idSupplier; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
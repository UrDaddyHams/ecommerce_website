package com.ecommerce.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_product")
    private Long idProduct;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "price")
    private Double price;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "id_category")
    private Long idCategory;

    @Column(name = "id_supplier")
    private Long idSupplier;

    public Product() {}

    public Product(String productName, Double price, Integer stock, String description, Long idCategory, Long idSupplier) {
        this.productName = productName;
        this.price = price;
        this.stock = stock;
        this.description = description;
        this.idCategory = idCategory;
        this.idSupplier = idSupplier;
    }

    // Getters and Setters
    public Long getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(Long idProduct) {
        this.idProduct = idProduct;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Long idCategory) {
        this.idCategory = idCategory;
    }

    public Long getIdSupplier() {
        return idSupplier;
    }

    public void setIdSupplier(Long idSupplier) {
        this.idSupplier = idSupplier;
    }
}
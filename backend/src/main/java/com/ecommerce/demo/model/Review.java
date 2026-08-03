package com.ecommerce.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_review")
    private Long idReview;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "review_date")
    private LocalDateTime reviewDate;

    // Changed FetchType to EAGER so the Customer object populates automatically
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_customer")
    @JsonIgnore
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product")
    @JsonIgnore
    private Product product;

    public Review() {}

    public Long getIdReview() { return idReview; }
    public void setIdReview(Long idReview) { this.idReview = idReview; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }

    public Customer getCustomer() { return customer; }

    @JsonProperty("customer")
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Product getProduct() { return product; }

    @JsonProperty("product")
    public void setProduct(Product product) {
        this.product = product;
    }

    // Direct flat getters/setters for convenience and payload mapping
    public Long getIdCustomer() {
        return customer != null ? customer.getIdCustomer() : null;
    }

    @JsonProperty("idCustomer")
    public void setIdCustomer(Long idCustomer) {
        if (idCustomer != null) {
            if (this.customer == null) this.customer = new Customer();
            this.customer.setIdCustomer(idCustomer);
        }
    }

    public Long getIdProduct() {
        return product != null ? product.getIdProduct() : null;
    }

    @JsonProperty("idProduct")
    public void setIdProduct(Long idProduct) {
        if (idProduct != null) {
            if (this.product == null) this.product = new Product();
            this.product.setIdProduct(idProduct);
        }
    }

    // Exposes the customer's username directly to the JSON response payload!
    @JsonProperty("username")
    public String getUsername() {
        if (this.customer != null && this.customer.getUsername() != null) {
            return this.customer.getUsername();
        }
        return "Customer #" + this.getIdCustomer();
    }
}
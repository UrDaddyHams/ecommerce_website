package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Customer;
import com.ecommerce.demo.model.Product;
import com.ecommerce.demo.model.Review;
import com.ecommerce.demo.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByProductId(Long idProduct) {
        return reviewRepository.findByProduct_IdProduct(idProduct);
    }

    public Review saveReview(Review review) {
        if (review.getCustomer() == null && review.getIdCustomer() != null) {
            Customer cust = new Customer();
            cust.setIdCustomer(review.getIdCustomer());
            review.setCustomer(cust);
        }
        if (review.getProduct() == null && review.getIdProduct() != null) {
            Product prod = new Product();
            prod.setIdProduct(review.getIdProduct());
            review.setProduct(prod);
        }
        if (review.getReviewDate() == null) {
            review.setReviewDate(LocalDateTime.now());
        }
        return reviewRepository.save(review);
    }

    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    @Transactional
    public Optional<Review> updateReview(Long id, Review reviewDetails) {
        if (id == null) {
            throw new IllegalArgumentException("Review ID must not be null");
        }

        return reviewRepository.findById(id)
                .map(existingReview -> {
                    if (reviewDetails.getRating() != null) {
                        existingReview.setRating(reviewDetails.getRating());
                    }
                    if (reviewDetails.getComment() != null) {
                        existingReview.setComment(reviewDetails.getComment());
                    }
                    return reviewRepository.save(existingReview);
                });
    }

    @Transactional
    public boolean deleteReview(Long id) {
        if (id != null && reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Review;
import com.ecommerce.demo.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getReviewsByProductId(Long idProduct) {
        // Assuming your repository has a custom finder method for product IDs
        return reviewRepository.findByIdProduct(idProduct);
    }

    public Review saveReview(Review review) {
        // Business logic rule: you could validate rating limits (1-5 stars) here later
        return reviewRepository.save(review);
    }

    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
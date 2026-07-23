package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Review;
import com.ecommerce.demo.repository.ReviewRepository;
import jakarta.transaction.Transactional;
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

        return reviewRepository.findByIdProduct(idProduct);
    }

    public Review saveReview(Review review) {

        return reviewRepository.save(review);
    }

    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
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
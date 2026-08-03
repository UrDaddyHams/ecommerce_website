import { useState, useEffect } from 'react';
import { getReviewsByProduct, postReview } from '../api/apiClient';
import { useToast } from '../context/ToastContext';

const DEFAULT_CUSTOMER_ID = 1;

export default function ReviewModal({ product, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const customerId = Number(localStorage.getItem('customerId')) || DEFAULT_CUSTOMER_ID;

  useEffect(() => {
    fetchReviews();
  }, [product.idProduct]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getReviewsByProduct(product.idProduct);
      setReviews(res.data || []);
    } catch {
      // reviews may be empty
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('Please select a star rating', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await postReview(rating, comment, customerId, product.idProduct);
      showToast('Review submitted! Thank you.', 'success');
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to submit review';
      showToast(typeof msg === 'string' ? msg : 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Reviews</h2>
            <p className="modal-subtitle">{product.productName}</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Summary */}
        <div className="review-summary">
          <div className="review-avg">
            <span className="avg-number">{avgRating}</span>
            <div className="avg-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`star ${s <= Math.round(Number(avgRating)) ? 'star-filled' : ''}`}>★</span>
              ))}
            </div>
            <span className="review-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Write Review Form */}
        <form onSubmit={handleSubmit} className="review-form">
          <h4>Write a Review</h4>
          <div className="star-input">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`star-btn ${s <= (hoverRating || rating) ? 'star-filled' : ''}`}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
            <span className="rating-label">
              {rating > 0 ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating] : 'Select rating'}
            </span>
          </div>
          <textarea
            id="review-comment"
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting || rating === 0}>
            {submitting ? <span className="spinner" /> : 'Submit Review'}
          </button>
        </form>

        {/* Existing Reviews */}
        <div className="reviews-list">
          {loading ? (
            <div className="loading-state"><div className="spinner-lg" /></div>
          ) : reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.idReview} className="review-item">
                <div className="review-item-header">
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`star-sm ${s <= review.rating ? 'star-filled' : ''}`}>★</span>
                    ))}
                  </div>
                  <span className="review-date">{formatDate(review.reviewDate)}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-author">{review.username}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

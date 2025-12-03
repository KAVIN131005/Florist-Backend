import React, { useState, useContext } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ThemeContext } from "../../context/themeContextDefinition";
import api from "../../services/api";

export default function OrderReviews({ order }) {
  const { dark } = useContext(ThemeContext);
  const { isAuthenticated } = useAuth();
  const [reviewedItems, setReviewedItems] = useState(new Set());
  const [submittingReview, setSubmittingReview] = useState(null);

  const submitReview = async (productId, rating, text = '') => {
    if (!isAuthenticated) {
      alert('Please sign in to leave a review');
      return;
    }

    setSubmittingReview(productId);
    try {
      await api.post(`/reviews/product/${productId}`, {
        rating,
        text
      });
      setReviewedItems(prev => new Set([...prev, productId]));
      // Show success message
      alert('Thank you for your review!');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already reviewed')) {
        setReviewedItems(prev => new Set([...prev, productId]));
        alert('You have already reviewed this product.');
      } else {
        console.error('Review submission error:', error);
        alert('Failed to submit review. Please try again.');
      }
    } finally {
      setSubmittingReview(null);
    }
  };

  if (!order?.items || order.items.length === 0) {
    return null;
  }

  return (
    <div className={`mt-6 p-6 rounded-2xl ${
      dark 
        ? 'bg-gradient-to-br from-purple-900 to-pink-900 border-purple-500' 
        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
    } border-2`}>
      <div className="mb-4">
        <h3 className={`text-lg font-bold ${dark ? 'text-purple-300' : 'text-purple-700'} mb-2`}>
          💐 How was your experience?
        </h3>
        <p className={`text-sm ${dark ? 'text-purple-400' : 'text-purple-600'}`}>
          Share your thoughts on the products you received
        </p>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <ProductReviewCard 
            key={item.productId}
            item={item}
            dark={dark}
            isReviewed={reviewedItems.has(item.productId)}
            isSubmitting={submittingReview === item.productId}
            onSubmitReview={submitReview}
          />
        ))}
      </div>
    </div>
  );
}

function ProductReviewCard({ item, dark, isReviewed, isSubmitting, onSubmitReview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);

  const handleStarClick = (starRating) => {
    if (isReviewed) return;
    setRating(starRating);
    setShowTextArea(true);
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmitReview(item.productId, rating, reviewText);
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <div className={`p-4 rounded-xl ${
      dark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 border border-gray-200'
    } ${isReviewed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h4 className={`font-medium ${dark ? 'text-white' : 'text-gray-800'} mb-2`}>
            {item.productName}
          </h4>
          
          {!isReviewed ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Rate this product:
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      disabled={isSubmitting}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl hover:scale-110 transition-transform disabled:opacity-50"
                    >
                      <span className={
                        star <= (hoverRating || rating) 
                          ? 'text-amber-400' 
                          : dark ? 'text-gray-600' : 'text-gray-300'
                      }>
                        ⭐
                      </span>
                    </button>
                  ))}
                </div>
                {(hoverRating || rating) > 0 && (
                  <span className={`text-xs ${dark ? 'text-amber-300' : 'text-amber-600'}`}>
                    {ratingLabels[(hoverRating || rating) - 1]}
                  </span>
                )}
              </div>

              {showTextArea && rating > 0 && (
                <div className="mb-3">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts about this product (optional)"
                    disabled={isSubmitting}
                    className={`w-full p-3 rounded-lg text-sm resize-none h-20 ${
                      dark 
                        ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || rating === 0}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                        dark
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      onClick={() => {
                        setShowTextArea(false);
                        setRating(0);
                        setReviewText('');
                      }}
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                        dark
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-gray-400 hover:bg-gray-500 text-white'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'} font-medium`}>
              ✅ Thank you for your review!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
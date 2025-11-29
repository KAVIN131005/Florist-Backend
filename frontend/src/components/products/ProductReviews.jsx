import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { parseApiError } from "../../utils/helpers";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axios.get(`/api/reviews/product/${productId}`)
      .then(res => { if (!cancelled) setReviews(res.data || []); })
      .catch(err => { if (!cancelled) setError(parseApiError(err)); });
    return () => { cancelled = true; };
  }, [productId]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const hoverTexts = ["Terrible","Bad","Okay","Good","Great"];

  const submit = async () => {
    if (!text.trim() && !rating) return;
    setSubmitting(true); setError(null);
    const payload = { text: text.trim(), rating };
    // Optimistic temp review
    const temp = {
      id: `temp_${Date.now()}`,
      text: payload.text,
      rating: payload.rating,
      user: { username: "You" },
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };
    setReviews(prev => [...prev, temp]);
    try {
      const res = await axios.post(`/api/reviews/product/${productId}`, payload);
      setReviews(prev => prev.map(r => r.id === temp.id ? res.data : r));
      setText("");
      setRating(0);
    } catch (err) {
      setError(parseApiError(err));
      // rollback optimistic
      setReviews(prev => prev.filter(r => r.id !== temp.id));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        <div className="text-sm text-amber-600 font-medium">
          {avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : "No ratings"}
        </div>
      </div>
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      {reviews.length === 0 && <p className="text-gray-500 mb-4">No reviews yet. Be the first!</p>}

      <ul className="space-y-3 mb-6">
        {reviews.slice().reverse().map(r => (
          <li key={r.id} className="border p-3 rounded-lg bg-gray-50 relative">
            <div className="flex items-center gap-2 mb-1">
              <RatingStars value={Number(r.rating || 0)} readOnly small />
              <span className="text-xs text-gray-500">{r.user?.username || r.user?.name || "Anon"}</span>
              {r._optimistic && <span className="text-[10px] text-blue-500">(posting…)</span>}
            </div>
            {r.text && <p className="text-gray-800 text-sm leading-snug">{r.text}</p>}
          </li>
        ))}
      </ul>

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <p className="text-sm font-medium mb-2">Add your review</p>
        <div className="flex items-center gap-2 mb-3">
          <RatingStars value={rating} onChange={setRating} />
          {rating > 0 && <span className="text-xs text-gray-500">{hoverTexts[rating-1]}</span>}
        </div>
        <textarea
          rows={3}
          placeholder="Share your experience (optional)"
          className="w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          disabled={submitting || (!text.trim() && !rating)}
          onClick={submit}
          className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-amber-600 disabled:opacity-50 hover:bg-amber-700 transition"
        >
          {submitting ? 'Posting…' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}

function RatingStars({ value=0, onChange=()=>{}, readOnly=false, small=false }) {
  const stars = [1,2,3,4,5];
  return (
    <div className={`inline-flex ${readOnly? '' : 'cursor-pointer'}`}>
      {stars.map(s => {
        const filled = s <= value;
        return (
          <svg
            key={s}
            onClick={() => !readOnly && onChange(s)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={filled ? '#f59e0b' : 'none'}
            stroke="#f59e0b"
            className={`${small? 'w-3 h-3' : 'w-5 h-5'} transition-colors`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

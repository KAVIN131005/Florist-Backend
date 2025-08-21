import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    axios.get(`/api/reviews/product/${productId}`).then((res) => setReviews(res.data));
  }, [productId]);

  const addReview = async () => {
    if (!text) return;
    const res = await axios.post(`/api/reviews/product/${productId}`, { text });
    setReviews([...reviews, res.data]);
    setText("");
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Reviews</h2>

      {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="border p-3 rounded-lg bg-gray-50">
            <p className="text-gray-800">{r.text}</p>
            <span className="text-xs text-gray-500">by {r.user?.username}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Write a review..."
          className="flex-1 border px-3 py-2 rounded-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={addReview}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Post
        </button>
      </div>
    </div>
  );
}

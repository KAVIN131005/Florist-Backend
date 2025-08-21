import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AddProduct() {
  const nav = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    newCategoryName: "",
    price: "",
    quantity: "",
    featured: false
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch categories
  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name.trim()) {
      setMessage("❌ Product name is required");
      return;
    }
    if (!product.categoryId && !product.newCategoryName.trim()) {
      setMessage("❌ Select or add a category");
      return;
    }
    if (!product.price || parseFloat(product.price) <= 0) {
      setMessage("❌ Price must be greater than 0");
      return;
    }

    const payload = {
      name: product.name.trim(),
      description: product.description?.trim() || "",
      imageUrl: product.imageUrl?.trim() || "",
      categoryId: product.categoryId ? parseInt(product.categoryId, 10) : null,
      newCategoryName: product.newCategoryName?.trim() || null,
      pricePer100g: product.price ? parseFloat(product.price) : null,
      stockGrams: product.quantity ? parseInt(product.quantity, 10) : 0,
      featured: Boolean(product.featured)
    };

    try {
      await api.post("/products", payload, { withCredentials: true });
      setMessage("✅ Product added successfully!");
      setProduct({
        name: "",
        description: "",
        imageUrl: "",
        categoryId: "",
        newCategoryName: "",
        price: "",
        quantity: "",
        featured: false
      });
      nav("/florist/products");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to add product";
      setMessage(`❌ ${errMsg}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="w-full p-2 border rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows={3}
        />

        {/* Image Preview */}
        {product.imageUrl && (
          <div className="w-full h-64 mb-2 flex justify-center items-center border rounded overflow-hidden bg-gray-100">
            <img
              src={product.imageUrl}
              alt="Preview"
              className="object-contain w-full h-full"
              onError={(e) => e.target.src = "https://via.placeholder.com/150?text=No+Image"}
            />
          </div>
        )}

        {/* Image URL */}
        <input
          name="imageUrl"
          value={product.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border rounded"
        />

        {/* Category Selection */}
        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          name="newCategoryName"
          value={product.newCategoryName}
          onChange={handleChange}
          placeholder="Or add new category"
          className="w-full p-2 border rounded"
        />

        {/* Price and Quantity */}
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price (₹ per 100g)"
          required
          min="1"
          step="0.01"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          placeholder="Quantity (grams)"
          min="0"
          step="1"
          className="w-full p-2 border rounded"
        />

        {/* Featured */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="featured"
            checked={product.featured}
            onChange={handleChange}
          />
          <span>Featured</span>
        </label>

        {/* Submit */}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Add Product
        </button>
      </form>

      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
}

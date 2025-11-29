import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    price: "",
    quantity: "",
    featured: false
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products/" + id)
      .then(res => {
        const prod = res.data;
        setProduct({
          name: prod.name || "",
          description: prod.description || "",
          imageUrl: prod.imageUrl || "",
          categoryId: prod.categoryId || "",
          price: prod.pricePer100g?.toString() || "",
          quantity: prod.stockGrams?.toString() || "",
          featured: prod.featured ?? false
        });
      })
      .catch(err => console.error("Error fetching product:", err));

    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      name: product.name.trim(),
      description: product.description?.trim() || null,
      imageUrl: product.imageUrl?.trim() || null,
      categoryId: product.categoryId ? parseInt(product.categoryId, 10) : null,
      pricePer100g: product.price ? parseFloat(product.price) : 0,
      stockGrams: product.quantity ? parseInt(product.quantity, 10) : 0,
      featured: Boolean(product.featured)
    };

    try {
      await api.put("/products/" + id, payload, { withCredentials: true });
      nav("/florist/products");
    } catch (err) {
      console.error("Error updating product:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" value={product.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />
        <textarea name="description" value={product.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" rows={3} />

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

        <input name="imageUrl" value={product.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />

        <select name="categoryId" value={product.categoryId} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>

        <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price (₹ per 100g)" required min="1" step="0.01" className="w-full p-2 border rounded" />
        <input type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="Quantity (grams)" required min="0" step="1" className="w-full p-2 border rounded" />

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="featured" checked={product.featured} onChange={handleChange} />
          <span>Featured</span>
        </label>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Save
        </button>
      </form>
    </div>
  );
}

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function AddProduct() {
  const { dark } = useContext(ThemeContext);
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
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch categories
  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Image preview effect
  useEffect(() => {
    if (product.imageUrl) {
      setImagePreview(product.imageUrl);
    }
  }, [product.imageUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear message when user starts typing
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!product.name.trim()) {
      setMessage("❌ Product name is required");
      setLoading(false);
      return;
    }
    if (!product.categoryId && !product.newCategoryName.trim()) {
      setMessage("❌ Select or add a category");
      setLoading(false);
      return;
    }
    if (!product.price || parseFloat(product.price) <= 0) {
      setMessage("❌ Price must be greater than 0");
      setLoading(false);
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
      setImagePreview("");
      
      // Navigate after a brief delay to show success message
      setTimeout(() => {
        nav("/florist/products");
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to add product";
      setMessage(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="relative">
              <div className="text-7xl animate-bounce transform hover:scale-110 transition-transform duration-300">➕</div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🌸</div>
            <div className="relative">
              <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">📝</div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-5xl md:text-6xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-6 relative`}>
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
                Add Product
              </span>
            </h1>
            <div className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium`}>
            🌺 Create a beautiful listing for your floral products
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto">
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient-x"></div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="text-lg">🌸</span>
                      Product Name
                    </label>
                    <input
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      placeholder="Enter beautiful product name..."
                      required
                      className={`
                        w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300
                        ${dark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }
                        focus:outline-none focus:ring-2 focus:ring-blue-200
                      `}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="text-lg">📝</span>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      placeholder="Describe your beautiful flowers..."
                      rows={4}
                      className={`
                        w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 resize-none
                        ${dark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }
                        focus:outline-none focus:ring-2 focus:ring-blue-200
                      `}
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="text-lg">🏷️</span>
                        Category
                      </label>
                      <select
                        name="categoryId"
                        value={product.categoryId}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-200`}
                      >
                        <option value="">Select existing category...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className={`text-center ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="text-sm font-medium">OR</span>
                    </div>
                    
                    <div>
                      <input
                        name="newCategoryName"
                        value={product.newCategoryName}
                        onChange={handleChange}
                        placeholder="Create new category..."
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-200`}
                      />
                    </div>
                  </div>

                  {/* Price and Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="text-lg">💰</span>
                        Price (₹ per 100g)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                        min="1"
                        step="0.01"
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-200`}
                      />
                    </div>
                    
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="text-lg">📦</span>
                        Stock (grams)
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={product.quantity}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        step="1"
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-200`}
                      />
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'}`}>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={product.featured}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`
                          w-14 h-8 rounded-full transition-all duration-300
                          ${product.featured 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                            : `${dark ? 'bg-gray-600' : 'bg-gray-300'}`
                          }
                        `}>
                          <div className={`
                            w-6 h-6 bg-white rounded-full shadow transform transition-all duration-300
                            ${product.featured ? 'translate-x-7 mt-1' : 'translate-x-1 mt-1'}
                          `}></div>
                        </div>
                      </div>
                      <div>
                        <span className={`flex items-center gap-2 font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                          <span className="text-lg">⭐</span>
                          Featured Product
                        </span>
                        <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Highlight this product on the homepage
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Right Column - Image Section */}
                <div className="space-y-6">
                  {/* Image URL Input */}
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="text-lg">🖼️</span>
                      Product Image URL
                    </label>
                    <input
                      name="imageUrl"
                      value={product.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/beautiful-flower.jpg"
                      className={`
                        w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300
                        ${dark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }
                        focus:outline-none focus:ring-2 focus:ring-blue-200
                      `}
                    />
                  </div>

                  {/* Image Preview */}
                  <div className={`border-2 border-dashed rounded-3xl transition-all duration-300 ${dark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'}`}>
                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Product Preview"
                          className="w-full h-64 object-cover rounded-3xl"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x300?text=🌸+Invalid+Image";
                            setImagePreview("");
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-3xl"></div>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            type="button"
                            onClick={() => {
                              setProduct(prev => ({...prev, imageUrl: ""}));
                              setImagePreview("");
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                          >
                            <span>🗑️</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col justify-center items-center text-center p-8">
                        <div className="text-6xl mb-4 animate-bounce">🖼️</div>
                        <h3 className={`text-lg font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Image Preview
                        </h3>
                        <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Enter an image URL above to see preview
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Image Guidelines */}
                  <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h4 className={`flex items-center gap-2 font-semibold mb-3 ${dark ? 'text-blue-300' : 'text-blue-700'}`}>
                      <span>💡</span>
                      Image Guidelines
                    </h4>
                    <ul className={`text-sm space-y-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Use high-quality, well-lit photos</li>
                      <li>• Recommended size: 800x600 pixels or larger</li>
                      <li>• Supported formats: JPG, PNG, WebP</li>
                      <li>• Show flowers from the best angle</li>
                      <li>• Ensure image loads quickly</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="border-t pt-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  {/* Message Display */}
                  {message && (
                    <div className={`
                      p-4 rounded-2xl text-center flex-1
                      ${message.includes('✅') 
                        ? `${dark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'} animate-pulse` 
                        : `${dark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`
                      }
                    `}>
                      <p className="font-medium">{message}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 min-w-fit">
                    <button
                      type="button"
                      onClick={() => nav("/florist/products")}
                      className={`
                        px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105
                        ${dark 
                          ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                      `}
                    >
                      Cancel
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className={`
                        flex items-center gap-3 px-8 py-3 rounded-2xl font-semibold 
                        transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                        ${loading 
                          ? `${dark ? 'bg-gray-600' : 'bg-gray-400'} cursor-not-allowed` 
                          : `${dark 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                          }`
                        }
                        text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
                      `}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Adding Product...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg">🌸</span>
                          <span>Add Product</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

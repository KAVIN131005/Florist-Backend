import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function MyProducts() {
  const { dark } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    api
      .get("/products/mine", {
        params: {
          page: 0,
          size: 50,
        },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err.response || err);
        setLoading(false);
      });
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || p.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name);
        case "price": return a.pricePer100g - b.pricePer100g;
        case "stock": return b.stockGrams - a.stockGrams;
        case "featured": return b.featured - a.featured;
        default: return 0;
      }
    });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className={`w-20 h-20 rounded-full border-4 border-t-transparent animate-spin ${dark ? 'border-emerald-400' : 'border-emerald-500'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-ping">🌸</span>
          </div>
        </div>
        <p className={`text-xl font-semibold ${dark ? 'text-emerald-300' : 'text-emerald-600'} animate-pulse`}>
          Loading Products...
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="relative">
              <div className="text-7xl animate-bounce transform hover:scale-110 transition-transform duration-300">🌸</div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">📦</div>
            <div className="relative">
              <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🌺</div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-5xl md:text-6xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-6 relative`}>
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent animate-gradient-x">
                My Products
              </span>
            </h1>
            <div className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium`}>
            🌿 Manage your beautiful flower collection and inventory
          </p>
          

        </div>
      </div>

      {/* Control Panel */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative p-6`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 animate-gradient-x"></div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-300
                    ${dark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-emerald-200
                  `}
                />
              </div>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`
                  px-4 py-3 rounded-2xl border-2 transition-all duration-300 min-w-48
                  ${dark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-emerald-200
                `}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`
                  px-4 py-3 rounded-2xl border-2 transition-all duration-300 min-w-40
                  ${dark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-emerald-200
                `}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="featured">Sort by Featured</option>
              </select>
            </div>
            
            {/* View Controls and Add Product */}
            <div className="flex gap-4 items-center">
              {/* View Mode Toggle */}
              <div className={`flex rounded-2xl p-1 ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium
                    ${viewMode === 'grid'
                      ? `${dark ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white'} shadow-lg transform scale-105`
                      : `${dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                    }
                  `}
                >
                  <span className="mr-2">⊞</span>Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`
                    px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium
                    ${viewMode === 'list'
                      ? `${dark ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white'} shadow-lg transform scale-105`
                      : `${dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                    }
                  `}
                >
                  <span className="mr-2">☰</span>List
                </button>
              </div>
              
              {/* Add Product Button */}
              <Link
                to="/florist/products/add"
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                  ${dark 
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400
                `}
              >
                <span className="text-xl">➕</span>
                <span>Add Product</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border shadow-lg p-6 text-center`}>
            <div className="text-3xl mb-2 animate-pulse">📊</div>
            <div className={`text-2xl font-bold ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {filteredProducts.length}
            </div>
            <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Products
            </div>
          </div>
          
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border shadow-lg p-6 text-center`}>
            <div className="text-3xl mb-2 animate-pulse">⭐</div>
            <div className={`text-2xl font-bold ${dark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {filteredProducts.filter(p => p.featured).length}
            </div>
            <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Featured Items
            </div>
          </div>
          
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border shadow-lg p-6 text-center`}>
            <div className="text-3xl mb-2 animate-pulse">📈</div>
            <div className={`text-2xl font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
              {categories.length}
            </div>
            <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Categories
            </div>
          </div>
          
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border shadow-lg p-6 text-center`}>
            <div className="text-3xl mb-2 animate-pulse">💰</div>
            <div className={`text-2xl font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>
              ₹{filteredProducts.reduce((sum, p) => sum + (p.pricePer100g * p.stockGrams / 100), 0).toFixed(0)}
            </div>
            <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Value
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      <div className="max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl p-12 text-center`}>
            <div className="text-8xl mb-6 animate-bounce">🌸</div>
            <h3 className={`text-2xl font-bold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {searchTerm || selectedCategory ? 'No Products Found' : 'No Products Yet'}
            </h3>
            <p className={`${dark ? 'text-gray-400' : 'text-gray-500'} mb-8`}>
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filters.'
                : 'Start your florist journey by adding your first product!'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <Link
                to="/florist/products/add"
                className={`
                  inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                  ${dark 
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'
                  }
                `}
              >
                <span className="text-xl">🌺</span>
                <span>Add Your First Product</span>
              </Link>
            )}
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredProducts.map(p => (
              viewMode === 'grid' ? (
                <div
                  key={p.id}
                  className={`
                    relative ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
                    rounded-3xl border shadow-lg hover:shadow-2xl 
                    transition-all duration-300 transform hover:scale-105 hover:-translate-y-2
                    overflow-hidden group
                  `}
                >
                  {/* Featured Badge */}
                  {p.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        <span>⭐</span>
                        FEATURED
                      </span>
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`
                      flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow-lg
                      ${p.stockGrams > 100 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' 
                        : p.stockGrams > 0 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                        : 'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                      }
                    `}>
                      <span>📦</span>
                      {p.stockGrams}g
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center relative">
                    <img
                      src={p.imageUrl || "https://via.placeholder.com/300x200?text=🌸+No+Image"}
                      alt={p.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=🌸+No+Image"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <h3 className={`font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-gray-900'} truncate`}>
                      {p.name}
                    </h3>
                    
                    {p.category && (
                      <p className={`text-sm ${dark ? 'text-emerald-400' : 'text-emerald-600'} font-medium mb-3 truncate`}>
                        🌿 {p.category}
                      </p>
                    )}

                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold text-xl ${dark ? 'text-green-400' : 'text-green-600'}`}>
                        ₹{p.pricePer100g}
                      </span>
                      <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        per 100g
                      </span>
                    </div>

                    <Link
                      to={`/florist/products/edit/${p.id}`}
                      className={`
                        w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold 
                        transition-all duration-300 transform hover:scale-105
                        ${dark 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                        }
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
                      `}
                    >
                      <span className="text-lg">✏️</span>
                      <span>Edit Product</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  key={p.id}
                  className={`
                    ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
                    rounded-2xl border shadow-lg hover:shadow-xl 
                    transition-all duration-300 p-6
                  `}
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Image */}
                    <div className="w-full md:w-32 h-32 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center flex-shrink-0">
                      <img
                        src={p.imageUrl || "https://via.placeholder.com/150?text=🌸"}
                        alt={p.name}
                        className="object-cover w-full h-full"
                        onError={(e) => e.target.src = "https://via.placeholder.com/150?text=🌸"}
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className={`font-bold text-xl ${dark ? 'text-white' : 'text-gray-900'} mb-1`}>
                            {p.name}
                          </h3>
                          {p.category && (
                            <p className={`text-sm ${dark ? 'text-emerald-400' : 'text-emerald-600'} font-medium`}>
                              🌿 {p.category}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {p.featured && (
                            <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              <span>⭐</span>
                              FEATURED
                            </span>
                          )}
                          <span className={`
                            flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow
                            ${p.stockGrams > 100 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' 
                              : p.stockGrams > 0 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                              : 'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                            }
                          `}>
                            <span>📦</span>
                            {p.stockGrams}g
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <span className={`font-bold text-2xl ${dark ? 'text-green-400' : 'text-green-600'}`}>
                            ₹{p.pricePer100g}
                          </span>
                          <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                            per 100g
                          </span>
                        </div>
                        
                        <Link
                          to={`/florist/products/edit/${p.id}`}
                          className={`
                            flex items-center gap-2 px-6 py-2 rounded-xl font-semibold 
                            transition-all duration-300 transform hover:scale-105
                            ${dark 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                            }
                          `}
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

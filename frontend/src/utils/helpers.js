// src/utils/helpers.js
export const formatCurrency = (v) => {
  if (v == null) return "₹0";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(v);
};

export const safe = (fn, fallback = null) => {
  try { return fn(); } catch { return fallback; }
};

export const parseApiError = (err) => {
  if (!err) return "Unknown error";
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.data) return JSON.stringify(err.response.data);
  if (err.message) return err.message;
  return String(err);
};

// Product filtering utilities
export const filterProducts = {
  byName: (products, searchTerm) => {
    if (!searchTerm?.trim()) return products;
    const term = searchTerm.toLowerCase().trim();
    return products.filter(p => 
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  },

  byCategory: (products, category) => {
    if (!category) return products;
    const categoryLower = category.toLowerCase();
    return products.filter(p => {
      const productCategory = p.categoryName || p.category || '';
      return productCategory.toLowerCase().includes(categoryLower);
    });
  },

  byPriceRange: (products, minPrice = 0, maxPrice = Infinity) => {
    return products.filter(p => {
      const price = p.pricePer100g || p.price || 0;
      return price >= minPrice && price <= maxPrice;
    });
  },

  byFlorist: (products, floristName) => {
    if (!floristName?.trim()) return products;
    const name = floristName.toLowerCase().trim();
    return products.filter(p => 
      p.floristName?.toLowerCase().includes(name) ||
      p.florist?.name?.toLowerCase().includes(name)
    );
  },

  // Combined filter function
  applyAllFilters: (products, filters = {}) => {
    let result = [...products];
    
    if (filters.search) {
      result = filterProducts.byName(result, filters.search);
    }
    
    if (filters.category) {
      result = filterProducts.byCategory(result, filters.category);
    }
    
    if (filters.priceRange && filters.priceRange.length === 2) {
      result = filterProducts.byPriceRange(result, filters.priceRange[0], filters.priceRange[1]);
    }
    
    if (filters.florist) {
      result = filterProducts.byFlorist(result, filters.florist);
    }
    
    return result;
  }
};

// Search utilities
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Sort utilities for products
export const sortProducts = {
  byName: (products, ascending = true) => {
    return [...products].sort((a, b) => {
      const nameA = a.name?.toLowerCase() || '';
      const nameB = b.name?.toLowerCase() || '';
      return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  },

  byPrice: (products, ascending = true) => {
    return [...products].sort((a, b) => {
      const priceA = a.pricePer100g || a.price || 0;
      const priceB = b.pricePer100g || b.price || 0;
      return ascending ? priceA - priceB : priceB - priceA;
    });
  },

  byCategory: (products, ascending = true) => {
    return [...products].sort((a, b) => {
      const catA = (a.categoryName || a.category || '').toLowerCase();
      const catB = (b.categoryName || b.category || '').toLowerCase();
      return ascending ? catA.localeCompare(catB) : catB.localeCompare(catA);
    });
  },

  byDate: (products, ascending = true) => {
    return [...products].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.dateAdded || 0);
      const dateB = new Date(b.createdAt || b.dateAdded || 0);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }
};

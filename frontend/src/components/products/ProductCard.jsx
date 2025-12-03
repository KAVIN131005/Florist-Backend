import React, { useContext, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/helpers";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { dark } = useContext(ThemeContext);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Handle different price field names
  const productPrice = product.pricePer100g || product.price || 0;
  const productCategory = product.categoryName || product.category || 'Uncategorized';
  const isFeatured = product.featured === true || product.isFeatured === true || product.featured === 'true' || product.isFeatured === 'true';

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(product);
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  return (
    <div className={`
      relative rounded-2xl overflow-hidden transition-all duration-500 ease-in-out
      ${dark 
        ? 'bg-gray-800 text-white shadow-lg hover:shadow-pink-900/20' 
        : 'bg-white text-gray-800 shadow-md hover:shadow-pink-300/50'
      }
      p-4 sm:p-5 transform hover:scale-[1.02] hover:-translate-y-1
      group/card
    `}>
      {isFeatured && (
        <span className={`
          absolute -top-2 -right-2 z-10 font-semibold px-3 py-1 
          rounded-full shadow-md text-xs
          ${dark 
            ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white' 
            : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white'
          }
          animate-pulse
        `}>
          Featured
        </span>
      )}
      
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-[4/3] group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        
        <img
          src={product.imageUrl || "/images/placeholder.jpg"}
          alt={product.name}
          className={`
            w-full h-full object-cover transition-all duration-700 ease-in-out
            ${isImageHovered ? 'scale-110 rounded-lg' : 'scale-100 rounded-lg'}
            group-hover:brightness-110
          `}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          onError={(e) => {
            e.target.src = "/images/placeholder.jpg";
          }}
        />
        
        <div className={`
          absolute bottom-0 left-0 right-0 p-2
          transform translate-y-full group-hover:translate-y-0
          transition-transform duration-300 ease-in-out z-20
        `}>
          <p className={`
            text-xs text-white bg-black/50 backdrop-blur-sm
            p-2 rounded-lg line-clamp-2
          `}>
            {product.description || "Beautiful floral arrangement"}
          </p>
        </div>
      </div>
      
      <div className="h-16 mb-3">
        <h3 className={`
          text-lg font-semibold line-clamp-2
          ${dark ? 'text-pink-200' : 'text-pink-700'}
          group-hover/card:text-pink-500 transition-colors duration-300
        `}>
          {product.name}
        </h3>
      </div>
      
      <div className="mb-3 flex justify-between items-center">
        <p className={`
          font-bold text-xl
          ${dark ? 'text-green-400' : 'text-green-600'}
          transition-all duration-300
          group-hover/card:scale-105 transform origin-left
        `}>
          {formatCurrency(productPrice)}
        </p>
        <p className={`
          text-sm capitalize px-2 py-1 rounded-full
          ${dark ? 'bg-gray-700 text-gray-300' : 'bg-pink-50 text-pink-800'}
        `}>
          {productCategory}
        </p>
      </div>

      {/* Rating Display */}
      {product.reviewCount && product.reviewCount > 0 ? (
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(product.averageRating || 0)
                    ? 'text-amber-400 fill-current'
                    : dark ? 'text-gray-600' : 'text-gray-300'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            {product.averageRating?.toFixed(1)} ({product.reviewCount} reviews)
          </span>
        </div>
      ) : (
        <div className="mb-3">
          <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            No reviews yet
          </span>
        </div>
      )}

      {product.floristName && (
        <p className={`
          text-xs mb-3 flex items-center gap-1
          ${dark ? 'text-gray-400' : 'text-gray-500'}
        `}>
          <span className="text-[10px]">👨‍🌾</span> 
          {product.floristName}
        </p>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className={`
          mt-auto w-full py-2.5 rounded-xl 
          font-medium text-sm flex items-center justify-center gap-2
          transition-all duration-300 transform
          ${isAddingToCart ? 'scale-95' : 'hover:scale-[1.02]'}
          focus:outline-none focus:ring-2 focus:ring-pink-500
          ${dark 
            ? 'bg-gradient-to-r from-pink-700 to-pink-600 text-white hover:from-pink-600 hover:to-pink-500' 
            : 'bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:from-pink-500 hover:to-pink-400'
          }
          relative overflow-hidden
        `}
      >
        <span className={`
          absolute inset-0 w-full h-full bg-white/20 
          transform ${isAddingToCart ? 'scale-x-100' : 'scale-x-0'} origin-left 
          transition-transform duration-700 ease-out
        `}></span>
        
        {isAddingToCart ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}

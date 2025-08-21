import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-green-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 via-purple-50 to-yellow-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              🌸 Welcome to <span className="text-pink-600">Florist Paradise</span> 🌸
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Your premier destination for fresh, beautiful flowers delivered with love. 
              Connect with verified local florists and brighten someone's day!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/shop" 
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🛍️ Shop Flowers
              </Link>
              <Link 
                to="/about" 
                className="bg-white hover:bg-gray-50 text-pink-600 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 border-2 border-pink-600 hover:border-pink-700"
              >
                🌿 Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose Florist Paradise?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">🌹</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Fresh & Beautiful</h3>
              <p className="text-gray-600">
                Hand-picked fresh flowers from verified local florists. 
                Every bouquet is crafted with care and attention to detail.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Same-day and next-day delivery options available. 
                We ensure your flowers arrive fresh and on time.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Verified Florists</h3>
              <p className="text-gray-600">
                All our florists are carefully verified and certified. 
                Quality and professionalism guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-yellow-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Perfect Flowers for Every Occasion
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">💐</div>
              <h3 className="font-bold text-gray-800">Weddings</h3>
              <p className="text-sm text-gray-600">Beautiful bridal bouquets</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">🎂</div>
              <h3 className="font-bold text-gray-800">Birthdays</h3>
              <p className="text-sm text-gray-600">Colorful birthday arrangements</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">💕</div>
              <h3 className="font-bold text-gray-800">Romance</h3>
              <p className="text-sm text-gray-600">Express your love</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">🌻</div>
              <h3 className="font-bold text-gray-800">Get Well</h3>
              <p className="text-sm text-gray-600">Brighten someone's day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Spread Joy?</h2>
          <p className="text-xl mb-8">
            Join thousands of happy customers who trust us with their special moments. 
            Browse our collection and find the perfect flowers today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop" 
              className="bg-white text-pink-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              🌸 Start Shopping
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white hover:bg-white hover:text-pink-600 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300"
            >
              💬 Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">500+</div>
              <p className="text-gray-600">Verified Florists</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">10K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">50+</div>
              <p className="text-gray-600">Cities Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">24/7</div>
              <p className="text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

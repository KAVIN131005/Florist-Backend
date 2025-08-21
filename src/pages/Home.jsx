import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/themeContextDefinition";

export default function Home() {
  const { dark } = useContext(ThemeContext);
  
  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${dark ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-pink-50 to-white text-black'}
    `}>
      {/* Hero Section */}
      <section className={`
        relative py-24 px-6 
        ${dark 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-pink-100 via-purple-50 to-yellow-50'
        }
      `}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-10">
            <h1 className={`
              text-5xl md:text-6xl font-bold mb-6 leading-tight
              ${dark ? 'text-white' : 'text-black'}
              relative
            `}>
              <span className="inline-block animate-float">🌸</span>{" "}
              Welcome to <span className={`${dark ? 'text-pink-300' : 'text-pink-600'}`}>Florist Paradise</span>{" "}
              <span className="inline-block animate-float" style={{ animationDelay: '0.5s' }}>🌸</span>
            </h1>
            <p className={`
              text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed
              ${dark ? 'text-gray-300' : 'text-black'}
            `}>
              Your premier destination for fresh, beautiful flowers delivered with love. 
              Connect with verified local florists and brighten someone's day!
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link 
                to="/shop" 
                className={`
                  ${dark 
                    ? 'bg-pink-700 hover:bg-pink-600' 
                    : 'bg-pink-600 hover:bg-pink-700'
                  } 
                  text-white font-bold py-4 px-10 rounded-full text-lg 
                  transition-all duration-300 transform hover:scale-105 shadow-lg
                  relative overflow-hidden group
                `}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent to-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
                🛍️ Shop Flowers
              </Link>
              <Link 
                to="/about" 
                className={`
                  ${dark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-pink-300 border-2 border-pink-700 hover:border-pink-500' 
                    : 'bg-white hover:bg-gray-50 text-pink-600 border-2 border-pink-600 hover:border-pink-700'
                  }
                  font-bold py-4 px-10 rounded-full text-lg transition-all duration-300
                `}
              >
                🌿 Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 px-6 ${dark ? 'bg-gray-900' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`
            text-4xl font-bold text-center mb-14
            ${dark ? 'text-white' : 'text-black'}
            relative inline-block mx-auto
            after:content-[""] after:absolute after:w-24 after:h-1
            after:bg-pink-500 after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2
            after:rounded-full
          `}>
            Why Choose Florist Paradise?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`
              text-center p-8 rounded-xl transition-all duration-300
              transform hover:scale-105 hover:-translate-y-1
              ${dark 
                ? 'bg-gray-800 shadow-lg hover:shadow-pink-900/20' 
                : 'bg-white shadow-lg hover:shadow-xl'
              }
            `}>
              <div className="text-6xl mb-6 animate-float">🌹</div>
              <h3 className={`text-2xl font-bold mb-4 ${dark ? 'text-pink-200' : 'text-black'}`}>
                Fresh & Beautiful
              </h3>
              <p className={`${dark ? 'text-gray-300' : 'text-black'}`}>
                Hand-picked fresh flowers from verified local florists. 
                Every bouquet is crafted with care and attention to detail.
              </p>
            </div>
            <div className={`
              text-center p-8 rounded-xl transition-all duration-300
              transform hover:scale-105 hover:-translate-y-1
              ${dark 
                ? 'bg-gray-800 shadow-lg hover:shadow-pink-900/20' 
                : 'bg-white shadow-lg hover:shadow-xl'
              }
            `}>
              <div className="text-6xl mb-6 animate-float" style={{ animationDelay: '0.3s' }}>🚚</div>
              <h3 className={`text-2xl font-bold mb-4 ${dark ? 'text-pink-200' : 'text-black'}`}>
                Fast Delivery
              </h3>
              <p className={`${dark ? 'text-gray-300' : 'text-black'}`}>
                Same-day and next-day delivery options available. 
                We ensure your flowers arrive fresh and on time.
              </p>
            </div>
            <div className={`
              text-center p-8 rounded-xl transition-all duration-300
              transform hover:scale-105 hover:-translate-y-1
              ${dark 
                ? 'bg-gray-800 shadow-lg hover:shadow-pink-900/20' 
                : 'bg-white shadow-lg hover:shadow-xl'
              }
            `}>
              <div className="text-6xl mb-6 animate-float" style={{ animationDelay: '0.6s' }}>✨</div>
              <h3 className={`text-2xl font-bold mb-4 ${dark ? 'text-pink-200' : 'text-black'}`}>
                Verified Florists
              </h3>
              <p className={`${dark ? 'text-gray-300' : 'text-black'}`}>
                All our florists are carefully verified and certified. 
                Quality and professionalism guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className={`
        py-20 px-6 
        ${dark 
          ? 'bg-gray-800' 
          : 'bg-gradient-to-r from-yellow-50 to-pink-50'
        }
      `}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`
            text-4xl font-bold text-center mb-14
            ${dark ? 'text-white' : 'text-black'}
            relative inline-block mx-auto
            after:content-[""] after:absolute after:w-24 after:h-1
            after:bg-pink-500 after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2
            after:rounded-full
          `}>
            Perfect Flowers for Every Occasion
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className={`
              text-center p-6 rounded-lg transition-all duration-300
              transform hover:scale-105 hover:-translate-y-1
              ${dark 
                ? 'bg-gray-700 hover:bg-gray-600 shadow-md hover:shadow-pink-900/20' 
                : 'bg-white shadow-md hover:shadow-lg'
              }
              group
            `}>
              <div className="text-4xl mb-4 group-hover:animate-bounce-slow">💐</div>
              <h3 className={`font-bold mb-1 ${dark ? 'text-pink-200' : 'text-black'}`}>Weddings</h3>
              <p className={`text-sm ${dark ? 'text-gray-300' : 'text-black'}`}>Beautiful bridal bouquets</p>
            </div>
            <div className={`
              text-center p-6 rounded-lg transition-all duration-300
              transform hover:scale-105 hover:-translate-y-1
              ${dark 
                ? 'bg-gray-700 hover:bg-gray-600 shadow-md hover:shadow-pink-900/20' 
                : 'bg-white shadow-md hover:shadow-lg'
              }
              group
            `}>
              <div className="text-4xl mb-4 group-hover:animate-bounce-slow">🎂</div>
              <h3 className={`font-bold mb-1 ${dark ? 'text-pink-200' : 'text-black'}`}>Birthdays</h3>
              <p className={`text-sm ${dark ? 'text-gray-300' : 'text-black'}`}>Colorful birthday arrangements</p>
            </div>
            <div className={`
              text-center p-6 rounded-lg transition-all duration-300
              transform hover:scale-105 hover:-translate-y-1
              ${dark 
                ? 'bg-gray-700 hover:bg-gray-600 shadow-md hover:shadow-pink-900/20' 
                : 'bg-white shadow-md hover:shadow-lg'
              }
              group
            `}>
              <div className="text-4xl mb-4 group-hover:animate-bounce-slow">💕</div>
              <h3 className={`font-bold mb-1 ${dark ? 'text-pink-200' : 'text-black'}`}>Romance</h3>
              <p className={`text-sm ${dark ? 'text-gray-300' : 'text-black'}`}>Express your love</p>
            </div>
            <div className={`
              text-center p-6 rounded-lg transition-all duration-300
              transform hover:scale-105 hover:-translate-y-1
              ${dark 
                ? 'bg-gray-700 hover:bg-gray-600 shadow-md hover:shadow-pink-900/20' 
                : 'bg-white shadow-md hover:shadow-lg'
              }
              group
            `}>
              <div className="text-4xl mb-4 group-hover:animate-bounce-slow">🌻</div>
              <h3 className={`font-bold mb-1 ${dark ? 'text-pink-200' : 'text-black'}`}>Get Well</h3>
              <p className={`text-sm ${dark ? 'text-gray-300' : 'text-black'}`}>Brighten someone's day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`
        py-20 px-6 relative overflow-hidden
        ${dark 
          ? 'bg-gradient-to-r from-pink-900 to-purple-900 text-white' 
          : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
        }
      `}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="rgba(255,255,255,0.3)" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Spread Joy?</h2>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            Join thousands of happy customers who trust us with their special moments. 
            Browse our collection and find the perfect flowers today!
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              to="/shop" 
              className="bg-white text-pink-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🌸 Start Shopping
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:border-pink-200"
            >
              💬 Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`
        py-20 px-6
        ${dark ? 'bg-gray-900' : 'bg-white'}
      `}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform transition-transform hover:scale-110">
              <div className={`
                text-5xl font-bold mb-3
                ${dark ? 'text-pink-400' : 'text-pink-600'}
              `}>
                500+
              </div>
              <p className={`
                font-medium
                ${dark ? 'text-gray-300' : 'text-black'}
              `}>
                Verified Florists
              </p>
            </div>
            <div className="transform transition-transform hover:scale-110">
              <div className={`
                text-5xl font-bold mb-3
                ${dark ? 'text-pink-400' : 'text-pink-600'}
              `}>
                10K+
              </div>
              <p className={`
                font-medium
                ${dark ? 'text-gray-300' : 'text-black'}
              `}>
                Happy Customers
              </p>
            </div>
            <div className="transform transition-transform hover:scale-110">
              <div className={`
                text-5xl font-bold mb-3
                ${dark ? 'text-pink-400' : 'text-pink-600'}
              `}>
                50+
              </div>
              <p className={`
                font-medium
                ${dark ? 'text-gray-300' : 'text-black'}
              `}>
                Cities Served
              </p>
            </div>
            <div className="transform transition-transform hover:scale-110">
              <div className={`
                text-5xl font-bold mb-3
                ${dark ? 'text-pink-400' : 'text-pink-600'}
              `}>
                24/7
              </div>
              <p className={`
                font-medium
                ${dark ? 'text-gray-300' : 'text-black'}
              `}>
                Customer Support
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

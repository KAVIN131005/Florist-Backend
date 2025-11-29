import React, { useContext } from "react";
import { ThemeContext } from "../context/themeContextDefinition";

export default function About() {
  const { dark } = useContext(ThemeContext);
  
  return (
    <div className={`py-12 px-4 max-w-7xl mx-auto ${dark ? "dark:bg-gray-900 dark:text-white" : ""}`}>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Florist Paradise 🌿</h1>
        <p className={`max-w-3xl mx-auto text-lg ${dark ? "text-gray-300" : "text-gray-600"}`}>
          We connect talented florists with flower lovers. Our platform ensures
          every bouquet is fresh, unique, and crafted with love.
          By supporting local florists, we promote sustainability and creativity.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className={`${dark ? "text-gray-300" : "text-gray-600"} mb-4`}>
            Founded in 2025, Florist Paradise was born from a vision to make flower ordering, inventory management, and delivery scheduling simpler and more dynamic through technology. While talented local florists often faced challenges in reaching wider audiences and managing orders efficiently, customers too struggled with limited options and inconsistent services.
          </p>
          <p className={`${dark ? "text-gray-300" : "text-gray-600"} mb-4`}>
            Our team, led by Kavin K, designed this platform to bridge that gap — combining the creativity of florists with the power of technology. Starting as a project to connect florists and customers in one seamless online marketplace, Florist Paradise has evolved into a full-featured platform where:
          </p>
          <p className={`${dark ? "text-gray-300" : "text-gray-600"} mb-4`}>
            Florists can showcase their unique arrangements, manage inventory, and handle orders with ease.
          </p>
          <p className={`${dark ? "text-gray-300" : "text-gray-600"}`}>
            Customers can browse, order, and even schedule deliveries — all in just a few clicks.
          </p>
          <p className={`${dark ? "text-gray-300" : "text-gray-600"} mt-4`}>
            From its beginning as a student project, it has grown into a solution designed to empower both florists and flower lovers alike, redefining the way flowers are bought and sold in the digital age.
          </p>
        </div>
        <div className="rounded-lg h-96 flex items-center justify-center overflow-hidden">
          <img 
            src="https://static.toiimg.com/imagenext/toiblogs/photo/blogs/wp-content/uploads/2025/02/hk2.png" 
            alt="Florist Paradise team" 
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Mission & Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} p-6 rounded-lg shadow-sm border`}>
            <div className="text-pink-500 text-4xl mb-4">♻️</div>
            <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
            <p className={`${dark ? "text-gray-300" : "text-gray-600"}`}>
              We're committed to eco-friendly practices. Our platform prioritizes seasonal blooms and reduces carbon footprint 
              through local sourcing and biodegradable packaging.
            </p>
          </div>
          <div className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} p-6 rounded-lg shadow-sm border`}>
            <div className="text-pink-500 text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className={`${dark ? "text-gray-300" : "text-gray-600"}`}>
              We support small businesses and local economies. Every purchase on our platform directly benefits independent 
              florists and their communities.
            </p>
          </div>
          <div className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} p-6 rounded-lg shadow-sm border`}>
            <div className="text-pink-500 text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Artistry</h3>
            <p className={`${dark ? "text-gray-300" : "text-gray-600"}`}>
              We celebrate floral design as an art form. Our platform showcases the unique talents and creative expressions 
              of our diverse community of florists.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              name: "Marcus Williams", 
              role: "CTO", 
              background: "Former tech lead at Amazon with a passion for gardening",
              image: "https://randomuser.me/api/portraits/men/46.jpg"
            },
            { 
              name: "Sofia Rodriguez", 
              role: "Creative Director", 
              background: "Award-winning floral designer with 15+ years of experience",
              image: "https://randomuser.me/api/portraits/women/65.jpg"
            },
            { 
              name: "David Kim", 
              role: "Head of Operations", 
              background: "Supply chain expert ensuring flowers arrive fresh and beautiful",
              image: "https://randomuser.me/api/portraits/men/22.jpg"
            }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className={`w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full shadow-md border-4 ${dark ? "border-pink-800" : "border-pink-100"}`}>
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className={`${dark ? "text-pink-400" : "text-pink-500"} font-medium`}>{member.role}</p>
              <p className={`${dark ? "text-gray-300" : "text-gray-600"} mt-2`}>{member.background}</p>
            </div>
          ))}
        </div>
      </div>



      {/* Join Us Section */}
      <div className={`${dark 
        ? "bg-gray-800 text-white" 
        : "bg-gradient-to-r from-pink-50 to-pink-100"} 
        p-8 rounded-lg text-center`}>
        <h2 className={`text-2xl font-bold mb-4 ${dark ? "text-white" : ""}`}>Join Our Growing Community</h2>
        <p className={`${dark ? "text-gray-200" : "text-gray-600"} max-w-2xl mx-auto mb-6`}>
          Whether you're a talented florist looking to expand your customer base or a flower enthusiast
          searching for unique arrangements, we welcome you to our blooming community.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full transition duration-300">
            Apply as a Florist
          </button>
          <button className={`${dark 
            ? "bg-gray-700 hover:bg-gray-600 text-pink-300 border-pink-400" 
            : "bg-white hover:bg-gray-100 text-pink-500 border-pink-500"} 
            border py-2 px-6 rounded-full transition duration-300`}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

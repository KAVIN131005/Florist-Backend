import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/themeContextDefinition";
import api from "../../services/api";

export default function BecomeFlorist() {
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // success or error
  const [gstin, setGstin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dark } = useContext(ThemeContext);

  const submitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg("");
    
    try {
      await api.post(
        "/florist/apply",
        { shopName, description, gstNumber: gstin },
        { withCredentials: true }
      );
      setMsg("Application submitted successfully! We'll review it and get back to you soon.");
      setMsgType("success");
      // Clear form on success
      setShopName("");
      setDescription("");
      setGstin("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error submitting application. Please try again.");
      setMsgType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'} relative overflow-hidden`}>
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400 via-emerald-500 to-cyan-500 rounded-full opacity-12 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 rounded-full opacity-6 blur-3xl animate-spin" style={{animationDuration: '30s'}}></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-20 text-6xl opacity-20 animate-bounce filter drop-shadow-lg" style={{animationDelay: '1s', animationDuration: '4s'}}>🌻</div>
      <div className="absolute top-40 right-32 text-4xl opacity-25 animate-bounce filter drop-shadow-md" style={{animationDelay: '2s', animationDuration: '5s'}}>🌺</div>
      <div className="absolute bottom-32 left-32 text-5xl opacity-20 animate-bounce filter drop-shadow-lg" style={{animationDelay: '3s', animationDuration: '4.5s'}}>🌸</div>
      <div className="absolute bottom-20 right-20 text-3xl opacity-30 animate-bounce filter drop-shadow-sm" style={{animationDelay: '1.5s', animationDuration: '3.8s'}}>🌿</div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-3xl shadow-2xl mb-8 animate-float-gentle">
            <span className="text-4xl filter drop-shadow-lg">🌺</span>
          </div>
          
          <h1 className={`text-5xl font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 bg-clip-text text-transparent">
              Become a Florist
            </span>
          </h1>
          
          <p className={`text-xl leading-relaxed max-w-3xl mx-auto ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join our community of passionate florists and share your beautiful creations with flower lovers worldwide. 
            Start your journey in the <span className="text-emerald-600 font-semibold">blossoming marketplace</span> today.
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
            <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${dark ? 'border-gray-700' : 'border-white/20'} shadow-lg hover:shadow-xl transition-all duration-300`}>
              <div className="text-3xl font-bold text-emerald-600 mb-2">1000+</div>
              <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Active Florists</div>
            </div>
            <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${dark ? 'border-gray-700' : 'border-white/20'} shadow-lg hover:shadow-xl transition-all duration-300`}>
              <div className="text-3xl font-bold text-emerald-600 mb-2">50K+</div>
              <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Happy Customers</div>
            </div>
            <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${dark ? 'border-gray-700' : 'border-white/20'} shadow-lg hover:shadow-xl transition-all duration-300`}>
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Support Available</div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className={`relative ${dark ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border ${dark ? 'border-gray-700/50' : 'border-white/40'} rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition-all duration-700 animate-slide-in-up`} style={{animationDelay: '0.3s'}}>
          {/* Form Header Gradient */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-t-3xl animate-gradient-x"></div>
          
          <div className="mb-8">
            <h2 className={`text-3xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Application Details
            </h2>
            <p className={`text-lg ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              Tell us about your flower shop and we'll get you started on your journey.
            </p>
          </div>

          <form onSubmit={submitApplication} className="space-y-8">
            {/* Shop Name Field */}
            <div className="group">
              <label className={`block text-sm font-bold ${dark ? 'text-gray-200' : 'text-gray-800'} mb-3 uppercase tracking-wider group-focus-within:text-emerald-600 transition-all duration-300`}>
                <span className="inline-flex items-center gap-3 text-xs">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">🏪</span>
                  Shop Name
                </span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your beautiful flower shop name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                  className={`w-full px-5 py-4 ${dark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200/60 text-gray-800'} border-2 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white focus:shadow-lg transition-all duration-500 placeholder-gray-400 font-medium text-lg hover:border-emerald-300 hover:shadow-md`}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 group-focus-within:text-emerald-500 group-focus-within:scale-110 transition-all duration-300 text-xl">✨</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full"></div>
              </div>
            </div>

            {/* Description Field */}
            <div className="group">
              <label className={`block text-sm font-bold ${dark ? 'text-gray-200' : 'text-gray-800'} mb-3 uppercase tracking-wider group-focus-within:text-emerald-600 transition-all duration-300`}>
                <span className="inline-flex items-center gap-3 text-xs">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">📝</span>
                  Shop Description
                </span>
              </label>
              <div className="relative group">
                <textarea
                  placeholder="Describe your flower shop, specialties, and what makes you unique..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  className={`w-full px-5 py-4 ${dark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200/60 text-gray-800'} border-2 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white focus:shadow-lg transition-all duration-500 placeholder-gray-400 font-medium text-lg hover:border-emerald-300 hover:shadow-md resize-none`}
                />
                <div className="absolute top-4 right-4 pointer-events-none">
                  <span className="text-gray-400 group-focus-within:text-emerald-500 group-focus-within:scale-110 transition-all duration-300 text-xl">🌸</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full"></div>
              </div>
            </div>

            {/* GSTIN Field */}
            <div className="group">
              <label className={`block text-sm font-bold ${dark ? 'text-gray-200' : 'text-gray-800'} mb-3 uppercase tracking-wider group-focus-within:text-emerald-600 transition-all duration-300`}>
                <span className="inline-flex items-center gap-3 text-xs">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">🏛️</span>
                  GSTIN (Tax ID)
                </span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your GSTIN number"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  required
                  className={`w-full px-5 py-4 ${dark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200/60 text-gray-800'} border-2 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white focus:shadow-lg transition-all duration-500 placeholder-gray-400 font-medium text-lg hover:border-emerald-300 hover:shadow-md`}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 group-focus-within:text-emerald-500 group-focus-within:scale-110 transition-all duration-300 text-xl">🔐</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full"></div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white py-6 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-emerald-500/25 btn-float-effect disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden transform hover:scale-[1.02] transition-all duration-500"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="animate-pulse">Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl group-hover:animate-bounce group-hover:scale-110 transition-all duration-300">🚀</span>
                      <span className="tracking-wide">Submit My Application</span>
                      <span className="text-xl opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
                    </>
                  )}
                </span>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
              </button>
            </div>
          </form>

          {/* Message Display */}
          {msg && (
            <div className={`mt-8 p-6 rounded-2xl border-2 animate-slide-in-up ${
              msgType === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {msgType === 'success' ? '✅' : '❌'}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{msgType === 'success' ? 'Success!' : 'Error'}</p>
                  <p className="text-base">{msg}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '💰',
              title: 'Earn More',
              description: 'Higher profit margins with direct customer access and premium pricing for quality flowers.',
              color: 'from-yellow-400 to-orange-500'
            },
            {
              icon: '🌍',
              title: 'Reach Globally',
              description: 'Expand your business beyond local boundaries and reach flower enthusiasts worldwide.',
              color: 'from-blue-400 to-indigo-500'
            },
            {
              icon: '📈',
              title: 'Grow Faster',
              description: 'Access to marketing tools, analytics, and business insights to accelerate your growth.',
              color: 'from-emerald-400 to-teal-500'
            }
          ].map((benefit, index) => (
            <div key={index} className={`relative ${dark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${dark ? 'border-gray-700/50' : 'border-white/20'} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-slide-in-up`} style={{animationDelay: `${0.6 + index * 0.2}s`}}>
              <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-6 animate-float-gentle`} style={{animationDelay: `${index * 0.5}s`}}>
                {benefit.icon}
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>{benefit.title}</h3>
              <p className={`text-lg leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

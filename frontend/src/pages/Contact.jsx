import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/themeContextDefinition";

const socials = [
  { name: 'Facebook', href: 'https://facebook.com/floristparadise', color: 'hover:bg-blue-600', bg: 'bg-blue-500', svg: (<path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.87 6.48 1.87 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.41V9.41c0-2.38 1.42-3.69 3.59-3.69 1.04 0 2.13.18 2.13.18v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.9h-2.22V22c4.78-.8 8.44-4.94 8.44-9.93Z" />) },
  { name: 'WhatsApp', href: 'https://wa.me/919876543210', color: 'hover:bg-green-600', bg: 'bg-green-500', svg: (<path d="M20.52 3.48A11.86 11.86 0 0 0 11.96 0C5.36 0 .02 5.34.02 11.93c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.64a11.9 11.9 0 0 0 5.66 1.44h.01c6.6 0 11.94-5.34 11.94-11.93a11.86 11.86 0 0 0-3.39-8.39ZM11.97 21.3a9.3 9.3 0 0 1-4.75-1.3l-.34-.2-3.73.97 1-3.64-.22-.37a9.23 9.23 0 0 1-1.4-4.9c0-5.12 4.17-9.29 9.3-9.29a9.21 9.21 0 0 1 6.58 2.72 9.21 9.21 0 0 1 2.72 6.57c0 5.13-4.17 9.3-9.3 9.3Zm5.12-6.91c-.28-.14-1.64-.81-1.89-.9-.25-.09-.43-.14-.62.14-.19.28-.72.9-.88 1.09-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.63-1.54-1.9-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.36-.02-.5-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.46-.16 0-.34-.02-.52-.02-.19 0-.5.07-.76.36-.26.28-.99.97-.99 2.37 0 1.39 1.02 2.74 1.16 2.93.14.19 2 3.05 4.84 4.28.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.64-.67 1.87-1.32.23-.64.23-1.19.16-1.32-.07-.12-.26-.19-.54-.33Z" />) },
  { name: 'Instagram', href: 'https://instagram.com/floristparadise.official', color: 'hover:bg-pink-600', bg: 'bg-pink-500', svg: (<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.97.24 2.43.41.61.24 1.05.53 1.51.99.46.46.75.9.99 1.51.17.46.35 1.26.41 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.24 1.97-.41 2.43a3.94 3.94 0 0 1-.99 1.51 3.94 3.94 0 0 1-1.51.99c-.46.17-1.26.35-2.43.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.06-1.97-.24-2.43-.41a3.94 3.94 0 0 1-1.51-.99 3.94 3.94 0 0 1-.99-1.51c-.17-.46-.35-1.26-.41-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.06-1.17.24-1.97.41-2.43.24-.61.53-1.05.99-1.51.46-.46.9-.75 1.51-.99.46-.17 1.26-.35 2.43-.41C8.42 2.17 8.8 2.16 12 2.16Zm0-2.16C8.74 0 8.33.01 7.05.07 5.78.13 4.79.33 4 .63a6.11 6.11 0 0 0-2.2 1.43A6.11 6.11 0 0 0 .63 4c-.3.79-.5 1.78-.56 3.05C.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.06 1.27.26 2.26.56 3.05.3.79.7 1.46 1.43 2.2a6.11 6.11 0 0 0 2.2 1.43c.79.3 1.78.5 3.05.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.26-.26 3.05-.56a6.11 6.11 0 0 0 2.2-1.43 6.11 6.11 0 0 0 1.43-2.2c.3-.79.5-1.78.56-3.05.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.26-.56-3.05a6.11 6.11 0 0 0-1.43-2.2A6.11 6.11 0 0 0 20 .63c-.79-.3-1.78-.5-3.05-.56C15.67.01 15.26 0 12 0Zm0 5.83a6.17 6.17 0 1 0 0 12.34 6.17 6.17 0 0 0 0-12.34Zm0 10.18a4.01 4.01 0 1 1 0-8.02 4.01 4.01 0 0 1 0 8.02Zm6.39-11.8a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />) },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/floristparadise', color: 'hover:bg-sky-700', bg: 'bg-sky-600', svg: (<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5.001ZM3 9h4v12H3V9Zm7.5 0h3.83v1.71h.05c.53-.96 1.84-1.97 3.79-1.97 4.05 0 4.8 2.67 4.8 6.14V21H18v-5.18c0-1.24-.02-2.84-1.73-2.84-1.74 0-2.01 1.36-2.01 2.74V21h-4.76V9Z" />) },
  { name: 'X', href: 'https://x.com/floristparadise', color: 'hover:bg-black', bg: 'bg-neutral-800', svg: (<path d="M18.244 1.987h3.308l-7.227 8.26 8.502 11.766h-6.654l-5.214-6.817-5.973 6.817H1.678l7.73-8.82L1.254 1.987h6.826l4.713 6.231 5.451-6.231Zm-1.162 18.013h1.833L7.084 3.94H5.117l11.965 16.06Z" />) }
];

const contactInfo = [
  {
    icon: "📍",
    title: "Visit Our Store",
    details: ["123 Flower Garden Street", "Blossom City, BC 12345", "Open Mon-Sat 9AM-7PM"]
  },
  {
    icon: "📞",
    title: "Call Us",
    details: ["+1 (555) 123-FLOWERS", "+1 (555) 123-3569", "Available 24/7 for orders"]
  },
  {
    icon: "✉️",
    title: "Email Us", 
    details: ["hello@floristparadise.com", "orders@floristparadise.com", "We reply within 2 hours"]
  }
];

export default function Contact() {
  const { dark } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${dark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-pink-50 via-white to-purple-50 text-gray-800'
      }
    `}>
      {/* Hero Section */}
      <section className={`
        py-16 px-6
        ${dark 
          ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700' 
          : 'bg-gradient-to-r from-pink-100 via-purple-50 to-yellow-50 border-b border-gray-200'
        }
      `}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`
            text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3
            ${dark ? 'text-white' : 'text-gray-900'}
          `}>
            <span className="animate-bounce">💬</span>
            Contact Us
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌸</span>
          </h1>
          <p className={`
            text-lg md:text-xl max-w-3xl mx-auto leading-relaxed
            ${dark ? 'text-gray-300' : 'text-gray-700'}
          `}>
            Have questions about our flowers? Need help with an order? 
            We're here to help you create beautiful moments with our fresh, stunning arrangements.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Contact Information Cards */}
        <section className="mb-16">
          <h2 className={`
            text-3xl font-bold text-center mb-12
            ${dark ? 'text-white' : 'text-gray-900'}
          `}>
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className={`
                p-8 rounded-xl text-center transition-all duration-300
                transform hover:scale-105 hover:-translate-y-2
                ${dark 
                  ? 'bg-gray-800 border border-gray-700 shadow-lg hover:shadow-pink-900/20' 
                  : 'bg-white shadow-lg hover:shadow-xl border border-gray-100'
                }
              `}>
                <div className="text-5xl mb-4 animate-pulse">{info.icon}</div>
                <h3 className={`text-xl font-bold mb-4 ${dark ? 'text-pink-300' : 'text-pink-600'}`}>
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, i) => (
                    <p key={i} className={`${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <section>
            <div className={`
              p-8 rounded-xl shadow-lg
              ${dark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-100'
              }
            `}>
              <h3 className={`
                text-2xl font-bold mb-6 flex items-center gap-2
                ${dark ? 'text-white' : 'text-gray-900'}
              `}>
                <span>📝</span>
                Send us a Message
              </h3>
              
              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
                  ✅ Thank you! Your message has been sent. We'll get back to you soon!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`
                        w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
                        ${dark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                        }
                        focus:outline-none focus:ring-2 focus:ring-pink-500/20
                      `}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
                        ${dark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                        }
                        focus:outline-none focus:ring-2 focus:ring-pink-500/20
                      `}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
                      ${dark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                      }
                      focus:outline-none focus:ring-2 focus:ring-pink-500/20
                    `}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
                      ${dark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-pink-500 focus:bg-gray-600' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-pink-500 focus:bg-pink-50'
                      }
                      focus:outline-none focus:ring-2 focus:ring-pink-500/20
                    `}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="delivery">Delivery Questions</option>
                    <option value="custom">Custom Arrangements</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="complaint">Complaint/Feedback</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
                      ${dark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                      }
                      focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none
                    `}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full px-6 py-4 rounded-lg font-medium text-white transition-all duration-300
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : dark 
                        ? 'bg-pink-600 hover:bg-pink-500' 
                        : 'bg-pink-500 hover:bg-pink-600'
                    }
                    transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>📨</span>
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Social Media & Additional Info */}
          <section className="space-y-8">
            {/* Social Media */}
            <div className={`
              p-8 rounded-xl shadow-lg
              ${dark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-100'
              }
            `}>
              <h3 className={`
                text-2xl font-bold mb-6 flex items-center gap-2
                ${dark ? 'text-white' : 'text-gray-900'}
              `}>
                <span>🌐</span>
                Follow Us
              </h3>
              <p className={`mb-6 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                Stay connected for daily flower inspiration, care tips, and special offers!
              </p>
              <div className="grid grid-cols-2 gap-4">
                {socials.map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group flex items-center gap-3 p-4 rounded-lg text-white transition-all duration-300
                      ${s.bg} ${s.color} shadow hover:shadow-lg transform hover:scale-105
                    `}
                    aria-label={s.name}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                      {s.svg}
                    </svg>
                    <span className="font-medium">{s.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ / Quick Info */}
            <div className={`
              p-8 rounded-xl shadow-lg
              ${dark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-100'
              }
            `}>
              <h3 className={`
                text-2xl font-bold mb-6 flex items-center gap-2
                ${dark ? 'text-white' : 'text-gray-900'}
              `}>
                <span>❓</span>
                Quick Answers
              </h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-2 ${dark ? 'text-pink-300' : 'text-pink-600'}`}>
                    🚚 Delivery Times
                  </h4>
                  <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Same-day delivery for orders placed before 2 PM. Next-day delivery available.
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-2 ${dark ? 'text-pink-300' : 'text-pink-600'}`}>
                    💐 Custom Orders
                  </h4>
                  <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    We create custom arrangements for special events. Contact us 48 hours in advance.
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-2 ${dark ? 'text-pink-300' : 'text-pink-600'}`}>
                    🔄 Returns
                  </h4>
                  <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Not satisfied? We offer full refund or replacement within 24 hours of delivery.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

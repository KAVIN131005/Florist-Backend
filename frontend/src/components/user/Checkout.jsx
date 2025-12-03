import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";
import cartService from "../../services/cartService";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/helpers";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { dark } = useContext(ThemeContext);
  const userId = user?.id || user?._id || user?.userId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [delivery, setDelivery] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: ""
  });

  const requiredFields = ["fullName","phone","addressLine","city","postalCode"];
  const missing = requiredFields.filter(f => !delivery[f].trim());
  const formValid = missing.length === 0;

  const updateField = (field, value) => setDelivery(d => ({ ...d, [field]: value }));

  const rawTotal = useMemo(() => cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price ?? item._raw?.price ?? 0) || 0),
    0
  ), [cart]);

  const couponApplied = (typeof window !== 'undefined') && (localStorage.getItem("couponCode") === "7FOREVER");
  const discount = couponApplied ? 20 : 0;
  const shippingCost = rawTotal >= 500 ? 0 : 50;
  const total = Math.max(0, rawTotal - discount + shippingCost);

  const handlePayment = async () => {
    setError("");
    setLoading(true);
    // If no cart items just return
    if (!cart.length) {
      setLoading(false);
      return;
    }

    if (!formValid) {
      setError("Please fill all delivery details before paying.");
      setTouched(true);
      setLoading(false);
      return;
    }

  // Using computed total (after discount and shipping) directly

    // Helper: local success finalize
  const finalizeSuccess = (payment = { method: "RAZORPAY", status: "PAID" }) => {
      const snapshotTotal = total; // discounted total
      const order = orderService.createLocalOrder({
        userId,
        items: cart,
        total: snapshotTotal,
        payment,
        address: delivery,
        discount: couponApplied ? { code: '7FOREVER', amount: 20 } : undefined,
        rawTotal,
      });
      
      // If payment is successful, schedule automatic delivery update after 5 seconds
      if (payment.status === "PAID") {
        setTimeout(() => {
          try {
            // Update order status to DELIVERED
            orderService.updateLocalOrderStatus(userId, order.id, "DELIVERED");
            console.log(`Order ${order.id} automatically marked as delivered`);
          } catch (error) {
            console.error("Failed to auto-update delivery status:", error);
          }
        }, 5000); // 5 seconds delay
      }
      
      clearCart();
      try { localStorage.removeItem('couponCode'); } catch { /* ignore */ }
      navigate("/user/orders");
    };

    try {
      // Attempt full backend + Razorpay flow if endpoints available
      const backendAvailable = !!paymentService?.createOrder && !!orderService?.createFromCart;
      if (backendAvailable) {
        try {
          // 0) Sync localStorage cart to backend first
          try {
            // Clear backend cart first
            await cartService.clearCart();
            // Add all localStorage items to backend cart
            for (const item of cart) {
              await cartService.addItem({ 
                productId: item.id, 
                quantity: item.quantity 
              });
            }
          } catch (cartSyncError) {
            console.warn("Failed to sync cart to backend, will use direct cart items approach");
            // Don't throw, will use direct cart items instead
          }

          // 1) Create backend order (try direct cart items first, fallback to synced cart)
          const addressString = `${delivery.fullName}, ${delivery.addressLine}, ${delivery.city}, ${delivery.postalCode}. Phone: ${delivery.phone}`;
          let created;
          const discountInfo = couponApplied ? { code: '7FOREVER', amount: 20.0 } : null;
          const shippingInfo = { cost: shippingCost, type: shippingCost === 0 ? 'FREE' : 'STANDARD', isFree: shippingCost === 0 };
          console.log('Checkout: rawTotal =', rawTotal, 'discount =', discount, 'shippingCost =', shippingCost, 'total =', total);
          console.log('Sending to backend - discountInfo:', discountInfo, 'shippingInfo:', shippingInfo);
          try {
            // Try creating order with cart items directly (new approach)
            created = await orderService.createFromCartItems(addressString, cart, discountInfo, shippingInfo);
          } catch (directOrderError) {
            console.warn("Direct cart items failed, trying synced cart approach", directOrderError);
            // Fallback to original cart-based approach
            created = await orderService.createFromCart(addressString, discountInfo, shippingInfo);
          }
          const appOrderId = created.id || created._id;
          if (!appOrderId) throw new Error("No order id returned");

          // 2) Create Razorpay order via backend
            const payInit = await paymentService.createOrder(appOrderId);
            const keyId = payInit.keyId || import.meta.env.VITE_RAZORPAY_KEY || import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!window.Razorpay || !keyId) {
              // Fallback: mark as paid locally
              finalizeSuccess({ method: "OFFLINE", status: "PAID", note: "Razorpay script/key missing" });
              return;
            }
            const options = {
              key: keyId,
              amount: payInit.amount, // already in paise
              currency: payInit.currency || "INR",
              name: "Florist E-commerce",
              description: `Order #${appOrderId}`,
              order_id: payInit.razorpayOrderId || payInit.id,
              handler: async function (response) {
                try {
                  await paymentService.confirmSuccess({
                    orderId: appOrderId,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  });
                  finalizeSuccess();
                } catch (err) {
                  console.error("Verification error", err);
                  setError("Payment verification failed. Stored locally as pending.");
                  finalizeSuccess({ method: "RAZORPAY", status: "PENDING" });
                }
              },
              theme: { color: "#16a34a" },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", function () {
              setError("Payment failed. Order stored as pending.");
              finalizeSuccess({ method: "RAZORPAY", status: "FAILED" });
            });
            razorpay.open();
            return; // stop further local only flow
        } catch (e) {
          console.warn("Backend payment flow failed, falling back to local only.", e);
        }
      }

      // Pure frontend fallback (simulate payment success)
      finalizeSuccess({ method: "SIMULATED", status: "PAID" });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-5xl">🛒</div>
            <div className="text-5xl">→</div>
            <div className="text-5xl">💳</div>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-2`}>
            Checkout
          </h1>
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
            Complete your order and get fresh flowers delivered
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? (dark ? 'bg-pink-600 text-white' : 'bg-pink-500 text-white') : (dark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500')} font-bold`}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span className={`hidden sm:block font-medium ${currentStep >= 1 ? (dark ? 'text-pink-400' : 'text-pink-600') : (dark ? 'text-gray-500' : 'text-gray-400')}`}>Delivery Details</span>
            
            <div className={`w-12 h-1 ${currentStep > 1 ? (dark ? 'bg-pink-600' : 'bg-pink-500') : (dark ? 'bg-gray-700' : 'bg-gray-300')}`}></div>
            
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? (dark ? 'bg-pink-600 text-white' : 'bg-pink-500 text-white') : (dark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500')} font-bold`}>
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <span className={`hidden sm:block font-medium ${currentStep >= 2 ? (dark ? 'text-pink-400' : 'text-pink-600') : (dark ? 'text-gray-500' : 'text-gray-400')}`}>Review & Pay</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden sticky top-8`}>
              <div className={`p-6 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-pink-600 to-purple-600' : 'border-gray-100 bg-gradient-to-r from-pink-500 to-purple-500'}`}>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📋</span>
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`w-12 h-12 rounded-lg overflow-hidden ${dark ? 'bg-gray-600' : 'bg-white'} border`}>
                        <img
                          src={item.imageUrl || "/images/placeholder.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </h4>
                        <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>
                          {formatCurrency((item.price ?? item._raw?.price ?? 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Breakdown */}
                <div className={`space-y-3 pt-4 border-t ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`${dark ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-2`}>
                      <span>🛍️</span>
                      Subtotal ({cart.length} items)
                    </span>
                    <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(rawTotal)}
                    </span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between items-center">
                      <span className={`${dark ? 'text-green-400' : 'text-green-600'} flex items-center gap-2`}>
                        <span>🎫</span>
                        Discount (7FOREVER)
                      </span>
                      <span className={`font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>
                        -{formatCurrency(discount)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className={`${dark ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-2`}>
                      <span>🚚</span>
                      Shipping
                    </span>
                    <span className={`font-bold ${shippingCost === 0 ? (dark ? 'text-green-400' : 'text-green-600') : (dark ? 'text-white' : 'text-gray-900')}`}>
                      {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  
                  {rawTotal < 500 && (
                    <div className={`text-xs p-2 rounded-lg ${dark ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                      💰 Add {formatCurrency(500 - rawTotal)} more for FREE shipping!
                    </div>
                  )}
                </div>
                
                {/* Total */}
                <div className={`pt-4 border-t-2 ${dark ? 'border-gray-600' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                      <span>💰</span>
                      Total
                    </span>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${dark ? 'text-pink-400' : 'text-pink-600'}`}>
                        {formatCurrency(total)}
                      </span>
                      {couponApplied && (
                        <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>
                          You saved ₹{discount}!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Badges */}
                <div className={`mt-6 p-4 rounded-xl ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">🔒</span>
                      <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>SSL Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">💳</span>
                      <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Safe Payment</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">🌸</span>
                      <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Fresh Flowers</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">📞</span>
                      <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden`}>
              {/* Delivery Details Section */}
              <div className={`p-6 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-gray-700 to-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                <h2 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <span>🏠</span>
                  Delivery Information
                </h2>
                <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  Where should we deliver your beautiful flowers?
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <span>👤</span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                          ${touched && !delivery.fullName 
                            ? 'border-red-500 focus:border-red-500' 
                            : dark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                          } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                        placeholder="Enter your full name"
                        value={delivery.fullName}
                        onChange={e => updateField('fullName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                          ${touched && !delivery.phone 
                            ? 'border-red-500 focus:border-red-500' 
                            : dark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                          } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                        placeholder="Your contact number"
                        value={delivery.phone}
                        onChange={e => updateField('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <span>📍</span>
                    Delivery Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Street Address *
                      </label>
                      <input
                        type="text"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                          ${touched && !delivery.addressLine 
                            ? 'border-red-500 focus:border-red-500' 
                            : dark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                          } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                        placeholder="House number, street name"
                        value={delivery.addressLine}
                        onChange={e => updateField('addressLine', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                          City *
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                            ${touched && !delivery.city 
                              ? 'border-red-500 focus:border-red-500' 
                              : dark 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                            } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                          placeholder="Your city"
                          value={delivery.city}
                          onChange={e => updateField('city', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                            ${touched && !delivery.postalCode 
                              ? 'border-red-500 focus:border-red-500' 
                              : dark 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                            } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                          placeholder="Postal code"
                          value={delivery.postalCode}
                          onChange={e => updateField('postalCode', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Instructions */}
                <div className={`p-4 rounded-xl ${dark ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className={`font-semibold ${dark ? 'text-blue-300' : 'text-blue-800'} mb-2`}>
                        Delivery Tips
                      </h4>
                      <ul className={`text-sm ${dark ? 'text-blue-200' : 'text-blue-700'} space-y-1`}>
                        <li>• Ensure someone is available to receive the flowers</li>
                        <li>• Our delivery team will call before arrival</li>
                        <li>• Fresh flowers are best kept in cool, shaded areas</li>
                        <li>• Delivery usually takes 2-4 hours within city limits</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className={`p-4 rounded-xl border ${dark ? 'bg-red-900/20 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} flex items-center gap-3`}>
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold mb-1">Payment Error</h4>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Form Validation */}
                {!formValid && touched && (
                  <div className={`p-4 rounded-xl border ${dark ? 'bg-yellow-900/20 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-700'} flex items-center gap-3`}>
                    <span className="text-2xl">📝</span>
                    <div>
                      <h4 className="font-semibold mb-1">Required Fields Missing</h4>
                      <p className="text-sm">Please fill in all required delivery information to continue.</p>
                      {missing.length > 0 && (
                        <p className="text-xs mt-1">Missing: {missing.join(', ')}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6">
                  <button
                    onClick={() => navigate('/cart')}
                    className={`flex-1 px-6 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                      ${dark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                      } flex items-center justify-center gap-2`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Cart</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentStep(2);
                      handlePayment();
                    }}
                    disabled={loading || total <= 0 || !formValid}
                    className={`flex-1 px-6 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1
                      ${loading || total <= 0 || !formValid 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : dark 
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700' 
                          : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                      } flex items-center justify-center gap-3 disabled:hover:scale-100 disabled:hover:translate-y-0`}
                  >
                    {loading ? (
                      <>
                        <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                          <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>💳</span>
                        <span>Pay {formatCurrency(total)}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

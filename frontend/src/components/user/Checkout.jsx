import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";
import cartService from "../../services/cartService";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const userId = user?.id || user?._id || user?.userId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
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
  const total = Math.max(0, rawTotal - discount);

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

  // Using computed total (after discount) directly

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
          try {
            // Try creating order with cart items directly (new approach)
            created = await orderService.createFromCartItems(addressString, cart);
          } catch (directOrderError) {
            console.warn("Direct cart items failed, trying synced cart approach", directOrderError);
            // Fallback to original cart-based approach
            created = await orderService.createFromCart(addressString);
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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      <div className="bg-white shadow p-4 rounded-xl mb-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">₹{rawTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount {couponApplied && <span className="text-green-600">(7Forever)</span>}</span>
          <span className={couponApplied ? "text-green-600" : "text-gray-500"}>-₹{discount}</span>
        </div>
        <div className="flex justify-between border-t pt-1 text-base">
          <span className="font-semibold">Amount to pay</span>
          <span className="font-semibold text-green-600">₹{total}</span>
        </div>
      </div>
      {/* Delivery Details */}
      <div className="bg-white shadow p-4 rounded-xl mb-4 space-y-3">
        <h2 className="font-semibold text-sm">Delivery Details</h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            className={`border rounded px-3 py-2 text-sm ${touched && !delivery.fullName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Full Name"
            value={delivery.fullName}
            onChange={e => updateField('fullName', e.target.value)}
          />
          <input
            className={`border rounded px-3 py-2 text-sm ${touched && !delivery.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Phone"
            value={delivery.phone}
            onChange={e => updateField('phone', e.target.value)}
          />
          <input
            className={`border rounded px-3 py-2 text-sm ${touched && !delivery.addressLine ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Address Line"
            value={delivery.addressLine}
            onChange={e => updateField('addressLine', e.target.value)}
          />
          <div className="flex gap-3">
            <input
              className={`flex-1 border rounded px-3 py-2 text-sm ${touched && !delivery.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="City"
              value={delivery.city}
              onChange={e => updateField('city', e.target.value)}
            />
            <input
              className={`w-32 border rounded px-3 py-2 text-sm ${touched && !delivery.postalCode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="PIN Code"
              value={delivery.postalCode}
              onChange={e => updateField('postalCode', e.target.value)}
            />
          </div>
          {!formValid && touched && (
            <p className="text-xs text-red-600">Please fill all required fields.</p>
          )}
        </div>
      </div>
      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading || total <= 0}
        className={`bg-green-600 text-white px-6 py-2 rounded ${loading || total <= 0 ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"}`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

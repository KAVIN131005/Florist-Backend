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

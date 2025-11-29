// src/utils/validators.js
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = ({ name, email, password }) => {
  if (!name || !name.trim()) return "Name required";
  if (!emailRegex.test(email)) return "Valid email required";
  if (!password || password.length < 6) return "Password must be at least 6 characters";
  return null;
};

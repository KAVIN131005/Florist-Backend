// src/utils/formatters.js
export const gramsToKg = (g) => `${(g/1000).toFixed(2)} kg`;
export const pricePer100gToPerKg = (pricePer100g) => (pricePer100g * 10);

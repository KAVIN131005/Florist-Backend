// src/utils/storage.js
import { STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from "./constants";

export const saveToken = (t) => {
  try { localStorage.setItem(STORAGE_TOKEN_KEY, t); } catch (error) { console.error('Failed to save token:', error); }
};

export const getToken = () => {
  try { return localStorage.getItem(STORAGE_TOKEN_KEY); } catch (error) { console.error('Failed to get token:', error); return null; }
};

export const clearToken = () => {
  try { localStorage.removeItem(STORAGE_TOKEN_KEY); } catch (error) { console.error('Failed to clear token:', error); }
};

export const saveUser = (u) => {
  try { localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(u)); } catch (error) { console.error('Failed to save user:', error); }
};

export const getUser = () => {
  try { const v = localStorage.getItem(STORAGE_USER_KEY); return v ? JSON.parse(v) : null; } catch (error) { console.error('Failed to get user:', error); return null; }
};

export const clearUser = () => {
  try { localStorage.removeItem(STORAGE_USER_KEY); } catch (error) { console.error('Failed to clear user:', error); }
};

export const clearAuth = () => { clearToken(); clearUser(); };

export default {
  saveToken, getToken, clearToken,
  saveUser, getUser, clearUser, clearAuth
};

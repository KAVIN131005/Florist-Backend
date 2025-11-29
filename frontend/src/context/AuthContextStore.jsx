// src/context/AuthContextStore.jsx
import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: () => false,
  hasRole: () => false,
  login: () => {},
  logout: () => {},
});

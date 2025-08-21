// src/context/NotificationContextDefinition.jsx
import { createContext } from "react";

export const NotificationContext = createContext({
  notify: () => {},
});

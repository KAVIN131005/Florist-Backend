import React, { useState } from "react";
import { NotificationContext } from "./NotificationContextDefinition";

export const NotificationProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const notify = (text, type = "info") => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`px-4 py-2 rounded-lg shadow text-white ${
              m.type === "error"
                ? "bg-red-500"
                : m.type === "success"
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

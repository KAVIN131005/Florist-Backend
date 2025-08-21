// src/components/common/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white py-6 mt-8">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} FloristApp. All rights reserved.</p>
        <div className="flex justify-center mt-2 space-x-4">
          <a
            href="/about"
            className="hover:underline"
          >
            About
          </a>
          <a
            href="/contact"
            className="hover:underline"
          >
            Contact
          </a>
          <a
            href="/shop"
            className="hover:underline"
          >
            Shop
          </a>
        </div>
      </div>
    </footer>
  );
}

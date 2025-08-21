import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get("/api/payment/history");
        setPayments(data);
      } catch (err) {
        console.error("Error fetching payment history:", err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payment History</h1>
      {payments.length === 0 ? (
        <p>No payment history available.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.orderId}</td>
                <td className="px-4 py-2">₹{p.amount}</td>
                <td className={`px-4 py-2 ${p.status === "SUCCESS" ? "text-green-600" : "text-red-600"}`}>
                  {p.status}
                </td>
                <td className="px-4 py-2">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

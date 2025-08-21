import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

export default function AllOrders(){
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      setOrders(data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading orders…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{o.id}</td>
                <td className="px-4 py-2">{o.user?.name ?? o.user?.email}</td>
                <td className="px-4 py-2">₹{o.totalAmount?.toFixed(2)}</td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => window.location = `/admin/orders/${o.id}`} className="px-2 py-1 bg-blue-600 text-white rounded">View</button>
                  <button onClick={() => { if(confirm("Mark shipped?")) adminService.updateOrderStatus(o.id, 'SHIPPED').then(()=>load()) }} className="px-2 py-1 bg-yellow-500 text-white rounded">Ship</button>
                  <button onClick={() => { if(confirm("Mark delivered?")) adminService.updateOrderStatus(o.id, 'DELIVERED').then(()=>load()) }} className="px-2 py-1 bg-green-600 text-white rounded">Deliver</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td className="p-4" colSpan="5">No orders</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

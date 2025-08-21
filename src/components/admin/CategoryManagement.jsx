/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

export default function CategoryManagement(){
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const c = await adminService.getCategories(); setCats(c || []); }
    catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCategory(name, desc);
      setName(""); setDesc("");
      await load();
    } catch (err) { alert(err.response?.data?.message || "Create failed"); }
  };

  const remove = async (id) => {
    if (!confirm("Delete category?")) return;
    try { await adminService.deleteCategory(id); await load(); }
    catch (e){ alert("Delete failed"); }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading categories…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Category Management</h2>

      <form onSubmit={create} className="flex gap-2 mb-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Category name" className="border p-2 rounded flex-1" required />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description (optional)" className="border p-2 rounded flex-1" />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <ul className="divide-y">
          {cats.map(c => (
            <li key={c.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-500">{c.description}</div>
              </div>
              <div>
                <button onClick={() => remove(c.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

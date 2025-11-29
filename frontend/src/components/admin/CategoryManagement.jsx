/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import productService from "../../services/productService";

export default function CategoryManagement(){
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

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

  const toggleVisibility = async (cat) => {
    // Optimistic update
    setCats(prev => prev.map(c => c.id === cat.id ? { ...c, visible: !c.visible } : c));
    try {
      if (adminService.setCategoryVisibility) {
        await adminService.setCategoryVisibility(cat.id, !cat.visible);
      } else {
        // Fallback: persist in localStorage for demo
        const key = "localCategoryVisibility";
        const map = JSON.parse(localStorage.getItem(key) || "{}");
        map[cat.id] = !cat.visible;
        localStorage.setItem(key, JSON.stringify(map));
      }
    } catch (e) {
      // Revert on failure
      setCats(prev => prev.map(c => c.id === cat.id ? { ...c, visible: cat.visible } : c));
      alert("Failed to update visibility");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete category?")) return;
    try { await adminService.deleteCategory(id); await load(); }
    catch (e){ alert("Delete failed"); }
  };

  const loadProducts = async (category) => {
    if (!category) { setProducts([]); return; }
    setProductsLoading(true);
    try {
      // Assuming backend supports filter by category name or id via query param 'category'
      const res = await productService.list({ category: category.name || category.id });
      // Some list endpoints may wrap in content property
      const list = Array.isArray(res) ? res : (res.content || []);
      setProducts(list);
    } catch (e) { console.error(e); setProducts([]); }
    finally { setProductsLoading(false); }
  };

  useEffect(() => { loadProducts(selectedCat); }, [selectedCat]);

  const removeProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productService.remove(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert("Failed to delete product"); }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading categories…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Category & Product Management</h2>

      <form onSubmit={create} className="flex gap-2 mb-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Category name" className="border p-2 rounded flex-1" required />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description (optional)" className="border p-2 rounded flex-1" />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Categories list */}
        <div className="bg-white rounded shadow overflow-hidden lg:col-span-1">
          <ul className="divide-y max-h-[480px] overflow-auto">
            {cats.map(c => {
              const active = selectedCat && selectedCat.id === c.id;
              return (
                <li
                  key={c.id}
                  className={`p-4 cursor-pointer flex flex-col gap-2 ${active ? "bg-indigo-50" : "bg-white hover:bg-gray-50"}`}
                  onClick={() => setSelectedCat(c)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium flex items-center gap-2">
                      {c.name}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.visible ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{c.visible ? "Visible" : "Hidden"}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">{c.description}</div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={(e) => { e.stopPropagation(); toggleVisibility(c); }} className="px-2 py-1 bg-yellow-500 text-white rounded text-xs">{c.visible ? "Hide" : "Show"}</button>
                    <button onClick={(e) => { e.stopPropagation(); remove(c.id); if (selectedCat?.id === c.id) setSelectedCat(null); }} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        {/* Products panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded shadow p-4 min-h-[200px]">
            <h3 className="font-semibold mb-2">{selectedCat ? `Products in '${selectedCat.name}'` : "Select a category"}</h3>
            {!selectedCat && <p className="text-sm text-gray-500">Choose a category from the left to view its products.</p>}
            {selectedCat && (
              productsLoading ? <p className="text-sm text-gray-500">Loading products…</p> : (
                products.length === 0 ? <p className="text-sm text-gray-500">No products in this category.</p> : (
                  <ul className="divide-y">
                    {products.map(p => (
                      <li key={p.id} className="py-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{p.name}</div>
                          <div className="text-xs text-gray-500">₹{p.price} · {p.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeProduct(p.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/StockForm.jsx
import React, { useEffect, useState } from "react";
import { supabase } from '../supabase/client';

const StockForm = () => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: "",
    action: "add",
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: productData } = await supabase.from("products").select("*");
      const { data: warehouseData } = await supabase.from("warehouses").select("*");
      setProducts(productData);
      setWarehouses(warehouseData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { product_id, warehouse_id, quantity, action } = formData;

    // Get existing stock
    const { data: existingStock } = await supabase
      .from("product_stock")
      .select("*")
      .eq("product_id", product_id)
      .eq("warehouse_id", warehouse_id)
      .single();

    let newQuantity = parseInt(quantity);

    if (existingStock) {
      newQuantity =
        action === "add"
          ? existingStock.quantity + newQuantity
          : existingStock.quantity - newQuantity;

      if (newQuantity < 0) {
        alert("Cannot dispatch more than available stock!");
        return;
      }

      await supabase
        .from("product_stock")
        .update({ quantity: newQuantity, updated_at: new Date() })
        .eq("id", existingStock.id);
    } else {
      if (action === "dispatch") {
        alert("No stock exists to dispatch.");
        return;
      }

      await supabase.from("product_stock").insert({
        product_id,
        warehouse_id,
        quantity: newQuantity,
      });
    }

    alert("Stock updated!");
    setFormData({ product_id: "", warehouse_id: "", quantity: "", action: "add" });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-4">
      <h2 className="text-lg font-bold mb-4">📦 Add or Dispatch Stock</h2>
      <div className="mb-3">
        <label className="block font-medium">Product</label>
        <select
          value={formData.product_id}
          onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block font-medium">Warehouse</label>
        <select
          value={formData.warehouse_id}
          onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Warehouse</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.state})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block font-medium">Quantity</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Action</label>
        <select
          value={formData.action}
          onChange={(e) => setFormData({ ...formData, action: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="add">Add Stock</option>
          <option value="dispatch">Dispatch Stock</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Submit
      </button>
    </form>
  );
};

export default StockForm;

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

export default function WarehouseStock() {
  const [warehouseData, setWarehouseData] = useState([]);
  const [stateSummary, setStateSummary] = useState([]);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    const { data: inventory, error: inventoryError } = await supabase
      .from('product_inventory_view')
      .select('*');

    const { data: stateData, error: stateError } = await supabase
      .from('state_stock_summary')
      .select('*');

    if (inventoryError || stateError) {
      console.error('Error fetching warehouse/state data:', inventoryError || stateError);
    } else {
      setWarehouseData(inventory);
      setStateSummary(stateData);
    }
  };

  return (
    <div>
      <h3>📦 Stock per Warehouse</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Warehouse</th>
            <th>State</th>
            <th>Quantity</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {warehouseData.map((item) => (
            <tr key={item.product_id + item.warehouse_name}>
              <td>{item.product_name}</td>
              <td>{item.category}</td>
              <td>{item.warehouse_name}</td>
              <td>{item.state}</td>
              <td>{item.quantity}</td>
              <td>{new Date(item.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>🌍 Total Stock per State</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>State</th>
            <th>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {stateSummary.map((summary) => (
            <tr key={summary.product_id + summary.state}>
              <td>{summary.product_name}</td>
              <td>{summary.state}</td>
              <td>{summary.total_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

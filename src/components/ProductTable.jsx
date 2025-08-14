// src/components/ProductTable.jsx
import React from 'react';
import { supabase } from '../supabase/client';

export default function ProductTable({ products, onProductUpdated }) {
  const handleDispatch = async (product) => {
    const quantityToDispatch = parseInt(
      prompt(`Enter quantity to dispatch from "${product.name}":`),
      10
    );

    if (isNaN(quantityToDispatch) || quantityToDispatch <= 0) {
      alert('Please enter a valid number');
      return;
    }

    const newQuantity = product.quantity - quantityToDispatch;
    if (newQuantity < 0) {
      alert('Not enough stock to dispatch that amount!');
      return;
    }

    // Step 1: Update the product quantity
    const { error: updateError } = await supabase
      .from('products')
      .update({ quantity: newQuantity })
      .eq('id', product.id);

    // Step 2: Log the dispatch in history table
    const { error: logError } = await supabase.from('dispatch_history').insert([
      {
        product_id: product.id,
        quantity_dispatched: quantityToDispatch,
        remarks: 'Dispatched manually from ProductTable',
      },
    ]);

    if (updateError || logError) {
      alert('Error processing dispatch');
      console.error(updateError || logError);
    } else {
      alert(`Dispatched ${quantityToDispatch} units from ${product.name}`);
      onProductUpdated(); // refresh product list
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Reorder Level</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.quantity}</td>
            <td>{product.reorder_level}</td>
            <td>
              <button onClick={() => handleDispatch(product)}>Dispatch</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

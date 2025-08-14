import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

export default function DispatchHistory() {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDispatches = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('dispatch')
      .select(`
        id, product_id, quantity, warehouse, dispatched_at,
        products(name)
      `)
      .eq('user_id', user.id)
      .order('dispatched_at', { ascending: false });

    if (error) console.error('Dispatch fetch error:', error);
    else setDispatches(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchDispatches();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Dispatch History (per Warehouse)</h2>
      {loading ? (
        <p>Loading dispatch history...</p>
      ) : (
        <div className="space-y-4">
          {dispatches.map((d) => (
            <div key={d.id} className="border rounded p-3 shadow">
              <p><strong>Warehouse:</strong> {d.warehouse}</p>
              <p><strong>Product:</strong> {d.products?.name}</p>
              <p><strong>Quantity:</strong> {d.quantity}</p>
              <p><strong>Date:</strong> {new Date(d.dispatched_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

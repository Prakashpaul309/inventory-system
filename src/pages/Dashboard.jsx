import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiTruck, FiHome, FiPlus, FiBox, FiLogOut } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import ProductTable from '../components/ProductTable';
import AddProductForm from '../components/AddProductForm';
import WarehouseStock from '../components/WarehouseStock';
import StockForm from '../components/StockForm';
import './Dashboard.css';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('You are not logged in');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setProducts(data);
      
      // Calculate stats
      const totalProducts = data.length;
      const lowStockItems = data.filter(product => product.quantity <= product.threshold).length;
      
      setStats({
        totalProducts,
        lowStockItems
      });
      
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="card stat-card" style={{ '--card-accent': color }}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{loading ? '...' : value}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header>
        <div className="header-content">
          <div>
            <h1>Inventory Management System</h1>
            <p>Welcome back! Here's what's happening with your inventory today.</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main>
        {/* Stats Overview */}
        <div className="stats-grid">
          <StatCard 
            icon={FiPackage} 
            title="Total Products" 
            value={stats.totalProducts}
            color="#4361ee"
          />
          <StatCard 
            icon={FiBox} 
            title="Low Stock Items" 
            value={stats.lowStockItems}
            color={stats.lowStockItems > 0 ? "#f44336" : "#4caf50"}
          />
        </div>

        {/* Products Section */}
        <section className="section">
          <div className="section-header">
            <h2>Products</h2>
          </div>
          <div className="card">
            {loading ? (
              <div className="loading-state">Loading products...</div>
            ) : (
              <ProductTable products={products} />
            )}
          </div>
        </section>

        {/* Add Product Form */}
        <section className="section">
          <h2>Add New Product</h2>
          <div className="card">
            <AddProductForm onProductAdded={fetchProducts} />
          </div>
        </section>

        {/* Warehouse Stock */}
        <section className="section">
          <h2>Warehouse Stock</h2>
          <div className="card">
            <WarehouseStock />
          </div>
        </section>

        {/* Stock Management */}
        <section className="section">
          <h2>Stock Management</h2>
          <div className="card">
            <StockForm />
          </div>
        </section>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { FiPlus, FiLoader, FiCheck, FiX } from 'react-icons/fi';
import './AddProductForm.css';

function AddProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    reorder_level: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories from database or use default ones
  useEffect(() => {
    const fetchCategories = async () => {
      // You can replace this with an actual API call to fetch categories
      setCategories([
        'Electronics',
        'Clothing',
        'Groceries',
        'Furniture',
        'Stationery',
        'Other'
      ]);
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous errors when user types
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (formData.quantity < 0) {
      setError('Quantity cannot be negative');
      return false;
    }
    if (formData.reorder_level < 0) {
      setError('Reorder level cannot be negative');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.from('products').insert([
        {
          name: formData.name.trim(),
          category: formData.category || 'Uncategorized',
          quantity: parseInt(formData.quantity) || 0,
          reorder_level: parseInt(formData.reorder_level) || 0,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      // Show success state
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        quantity: '',
        reorder_level: ''
      });
      
      // Call the callback to refresh the product list
      onProductAdded?.();
      
      // Reset success state after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-form">
      <h3 className="form-title">Add New Product</h3>
      
      {error && (
        <div className="alert error">
          <FiX className="alert-icon" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert success">
          <FiCheck className="alert-icon" />
          Product added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className="form-control"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="form-control"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              placeholder="0"
              value={formData.quantity}
              onChange={handleChange}
              disabled={loading}
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="reorder_level">Reorder Level</label>
          <input
            id="reorder_level"
            name="reorder_level"
            type="number"
            min="0"
            placeholder="0"
            value={formData.reorder_level}
            onChange={handleChange}
            disabled={loading}
            className="form-control"
          />
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <FiLoader className="spin" />
                <span>Adding Product...</span>
              </>
            ) : (
              <>
                <FiPlus />
                <span>Add Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductForm;

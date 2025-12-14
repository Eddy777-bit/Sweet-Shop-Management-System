import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogOut, Plus, ShoppingBag, Trash, Search, DollarSign, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [sweets, setSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSweet, setNewSweet] = useState({ name: '', category: '', price: '', quantity: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole);
      fetchSweets(token);
    }
  }, []);

  const fetchSweets = async (token) => {
    try {
      const response = await api.get('/sweets');
      setSweets(response.data);
    } catch (error) {
      console.error('Failed to fetch sweets', error);
      if (error.response && error.response.status === 403) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    navigate('/login');
    toast.success("Logged out successfully");
  };

  const handleDeleteSweet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    const token = localStorage.getItem('token');
    try {
      await api.delete(`/sweets/${id}`);
      toast.success("Sweet deleted from inventory");
      fetchSweets(token);
    } catch (error) {
      console.error('Failed to delete sweet', error);
      toast.error("Could not delete sweet");
    }
  };

  const handlePurchase = async (sweet) => {
    if (sweet.quantity <= 0) return;

    const token = localStorage.getItem('token');
    try {
      await api.post(`/sweets/${sweet.id}/purchase`, {});
      toast.success(`Purchased ${sweet.name}!`, {
        icon: '🍬',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      fetchSweets(token);
    } catch (error) {
      console.error('Failed to purchase sweet', error);
      toast.error("Purchase failed");
    }
  };

  const handleAddSweet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post('/sweets', newSweet);
      setShowAddModal(false);
      setNewSweet({ name: '', category: '', price: '', quantity: '' });
      fetchSweets(token);
      toast.success("New sweet added to inventory!");
    } catch (error) {
      console.error('Failed to add sweet', error);
      toast.error("Failed to add sweet");
    }
  };

  const filteredSweets = sweets.filter(sweet =>
    sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sweet.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container"
        style={{ padding: '2rem' }}
      >
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <header style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', borderRadius: '14px', boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)' }}>
                <ShoppingBag style={{ color: 'white' }} size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Sweet Inventory</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                  {role === 'ROLE_ADMIN' ? '👑 Admin Access' : '👤 Customer View'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search sweets..."
                  style={{
                    padding: '0.6rem 0.6rem 0.6rem 2.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(0,0,0,0.2)',
                    color: 'white',
                    width: '200px',
                    transition: 'all 0.2s'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              {role === 'ROLE_ADMIN' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  onClick={() => setShowAddModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Plus size={18} /> Add Sweet
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                style={{ padding: '0.75rem', borderRadius: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', cursor: 'pointer' }}
                title="Logout"
              >
                <LogOut size={18} />
              </motion.button>
            </div>
          </header>
        </div>

        <motion.div
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}
        >
          <AnimatePresence>
            {filteredSweets.map((sweet, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={sweet.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>{sweet.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {sweet.category}
                    </span>
                    {role === 'ROLE_ADMIN' && (
                      <motion.button
                        whileHover={{ scale: 1.1, color: '#ef4444' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteSweet(sweet.id)}
                        style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.7)', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Trash size={16} />
                      </motion.button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>₹{sweet.price}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>/ unit</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stock Available</span>
                  <span style={{ fontWeight: 'bold', color: sweet.quantity > 5 ? '#4ade80' : sweet.quantity > 0 ? '#fbbf24' : '#ef4444' }}>
                    {sweet.quantity} items
                  </span>
                </div>

                {role !== 'ROLE_ADMIN' && (
                  <motion.button
                    whileHover={sweet.quantity > 0 ? { scale: 1.02 } : {}}
                    whileTap={sweet.quantity > 0 ? { scale: 0.98 } : {}}
                    className="btn-primary"
                    style={{
                      marginTop: '1rem',
                      width: '100%',
                      opacity: sweet.quantity === 0 ? 0.5 : 1,
                      cursor: sweet.quantity === 0 ? 'not-allowed' : 'pointer',
                      background: sweet.quantity === 0 ? '#333' : undefined
                    }}
                    onClick={() => handlePurchase(sweet)}
                    disabled={sweet.quantity === 0}
                  >
                    {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase Now'}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredSweets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}
            >
              <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No sweets found matching your criteria.</p>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', zIndex: 100, inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="glass-panel"
                style={{ width: '100%', maxWidth: '400px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0 }}>Add New Sweet</h3>
                  <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleAddSweet}>
                  <input className="input-field" placeholder="Sweet Name" value={newSweet.name} onChange={e => setNewSweet({ ...newSweet, name: e.target.value })} required />
                  <input className="input-field" placeholder="Category (e.g. Cakes)" value={newSweet.category} onChange={e => setNewSweet({ ...newSweet, category: e.target.value })} required />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input className="input-field" type="number" placeholder="Price (₹)" value={newSweet.price} onChange={e => setNewSweet({ ...newSweet, price: e.target.value })} required />
                    <input className="input-field" type="number" placeholder="Qty" value={newSweet.quantity} onChange={e => setNewSweet({ ...newSweet, quantity: e.target.value })} required />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Sweet</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', padding: '4rem 0' }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          style={{ display: 'inline-block', marginBottom: '1rem' }}
        >
          <span style={{ fontSize: '4rem' }}>🍬</span>
        </motion.div>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(to right, #f472b6, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px' }}>
          Sweet Shop
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Experience the finest collection of handcrafted sweets. Delivered fresh to your doorstep.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </motion.header>
    </div>
  );
}

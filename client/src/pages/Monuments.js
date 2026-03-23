import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMonuments } from '../utils/api';
import './Monuments.css';

const TYPES = ['All', 'Sacred Temple', 'UNESCO World Heritage Site', 'Ancient Caves', 'Natural Wonder', 'Wildlife', 'Beach', 'Fort', 'Engineering Marvel'];

export default function Monuments() {
  const [monuments, setMonuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchMonuments().then(r => setMonuments(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = monuments
    .filter(m => filter === 'All' || m.type.includes(filter))
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : a.name.localeCompare(b.name));

  if (loading) return <div className="page"><div className="loading-screen"><div className="spinner" /><p className="loading-text">Loading Monuments...</p></div></div>;

  return (
    <div className="page">
      <div className="monuments-hero">
        <h1 className="section-title light">Monuments of Odisha</h1>
        <p className="section-desc light">Temples, caves, forts, and natural wonders — the heritage of Kalinga</p>
      </div>
      <section className="section section-cream">
        <div className="container">
          <div className="controls-row">
            <div className="filter-bar" style={{ justifyContent: 'flex-start', marginBottom: 0 }}>
              {TYPES.map(t => <button key={t} className={`filter-btn ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>)}
            </div>
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="rating">Sort: Rating</option>
              <option value="name">Sort: Name A–Z</option>
            </select>
          </div>
          <p className="results-count">{filtered.length} monuments found</p>
          <div className="grid-3">
            {filtered.map(m => (
              <Link to={`/monuments/${m.id}`} key={m.id} className="card mon-card">
                <div className="mon-emoji">{m.emoji}</div>
                <div className="mon-body">
                  <span className="badge badge-outline" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>{m.type}</span>
                  <h3 className="mon-name">{m.name}</h3>
                  <p className="mon-location">📍 {m.districtName}</p>
                  <p className="mon-desc">{m.description.substring(0, 100)}...</p>
                  <div className="mon-footer">
                    <span className="mon-rating">⭐ {m.rating}</span>
                    <span className="mon-fee">🎟️ {m.entryFee}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

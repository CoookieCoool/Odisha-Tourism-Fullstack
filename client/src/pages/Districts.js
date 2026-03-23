import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDistricts } from '../utils/api';
import './Districts.css';

const REGIONS = ['All', 'Coastal', 'Central', 'Western', 'Northern', 'Southern', 'Southern Tribal'];

export default function Districts() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchDistricts()
      .then(r => setDistricts(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? districts : districts.filter(d => d.region === filter);

  if (loading) return <div className="page"><div className="loading-screen"><div className="spinner" /><p className="loading-text">Loading Districts...</p></div></div>;

  return (
    <div className="page">
      <div className="districts-hero">
        <h1 className="section-title light">Districts of Odisha</h1>
        <p className="section-desc light">30 districts — each with unique culture, monuments, and natural wonders</p>
      </div>

      <section className="section section-cream">
        <div className="container">
          <div className="filter-bar">
            {REGIONS.map(r => (
              <button key={r} className={`filter-btn ${filter === r ? 'active' : ''}`} onClick={() => setFilter(r)}>{r}</button>
            ))}
          </div>
          <div className="grid-3">
            {filtered.map(d => (
              <Link to={`/districts/${d.id}`} key={d.id} className="card district-card">
                <div className="dc-top">
                  <span className="dc-emoji">{d.image}</span>
                  <div>
                    <span className="badge badge-gold">{d.region}</span>
                    <h2 className="dc-name">{d.name}</h2>
                  </div>
                </div>
                <p className="dc-overview">{d.overview}</p>
                <div className="dc-meta">
                  <span>📍 {d.headquarters}</span>
                  <span>🏛️ {d.monumentCount} Monuments</span>
                </div>
                <div className="dc-meta">
                  <span>📅 Best: {d.bestSeason}</span>
                  <span>🗣️ {d.language}</span>
                </div>
                <div className="dc-link">Explore {d.name} →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDistrict } from '../utils/api';
import './DistrictDetail.css';

export default function DistrictDetail() {
  const { id } = useParams();
  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchDistrict(id).then(r => setDistrict(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><div className="loading-screen"><div className="spinner" /><p className="loading-text">Loading...</p></div></div>;
  if (!district) return <div className="page"><div className="error-box"><h3>District not found</h3><Link to="/districts" className="btn btn-primary">Back to Districts</Link></div></div>;

  return (
    <div className="page">
      <div className="dd-hero">
        <div className="dd-hero-emoji">{district.image}</div>
        <div>
          <Link to="/districts" className="dd-back">← All Districts</Link>
          <h1 className="dd-title">{district.name} District</h1>
          <p className="dd-overview">{district.overview}</p>
          <div className="dd-tags">
            <span className="badge badge-gold">{district.region} Region</span>
            <span className="badge badge-teal">Best: {district.bestSeason}</span>
            <span className="badge badge-saffron">{district.monuments.length} Monuments</span>
          </div>
          <div className="dd-info-row">
            <span>📍 HQ: {district.headquarters}</span>
            <span>📐 Area: {district.area}</span>
            <span>🗣️ {district.language}</span>
          </div>
        </div>
      </div>

      <section className="section section-cream">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">✦ Places to Visit ✦</span>
            <h2 className="section-title">Monuments & Attractions</h2>
            <div className="section-line" />
          </div>
          <div className="monuments-grid">
            {district.monuments.map(m => (
              <div key={m.id} className="card monument-card">
                <div className="mc-header">
                  <span className="mc-emoji">{m.emoji}</span>
                  <div>
                    <span className="badge badge-outline" style={{ fontSize: '0.65rem' }}>{m.type}</span>
                    <h3 className="mc-name">{m.name}</h3>
                  </div>
                </div>
                <p className="mc-desc">{m.description}</p>
                <div className="mc-details">
                  <div><span>🕐</span>{m.timings}</div>
                  <div><span>🎟️</span>{m.entryFee}</div>
                  {m.builtBy !== 'Natural' && <div><span>👑</span>Built by {m.builtBy}</div>}
                  <div><span>📅</span>{m.builtIn}</div>
                  <div><span>⭐</span>{m.rating}/5</div>
                </div>
                <div className="mc-highlights">
                  {m.highlights.map(h => <span key={h} className="highlight-tag">{h}</span>)}
                </div>
                <button className="history-toggle" onClick={() => setExpanded(p => ({ ...p, [m.id]: !p[m.id] }))}>
                  {expanded[m.id] ? '▼ Hide' : '▶ Read'} Historical Background
                </button>
                {expanded[m.id] && <div className="history-text fade-up">{m.history}</div>}
                <Link to={`/monuments/${m.id}`} className="btn btn-teal" style={{ marginTop: '1rem', fontSize: '0.75rem', padding: '0.6rem 1.2rem' }}>Full Details →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMonument } from '../utils/api';
import './MonumentDetail.css';

export default function MonumentDetail() {
  const { id } = useParams();
  const [monument, setMonument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonument(id).then(r => setMonument(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><div className="loading-screen"><div className="spinner" /><p className="loading-text">Loading...</p></div></div>;
  if (!monument) return <div className="page"><div className="error-box"><h3>Monument not found</h3><Link to="/monuments" className="btn btn-primary">Back</Link></div></div>;

  return (
    <div className="page">
      <div className="md-hero">
        <div className="md-emoji">{monument.emoji}</div>
        <div className="md-hero-content">
          <Link to="/monuments" className="dd-back">← All Monuments</Link>
          <span className="badge badge-saffron" style={{ marginTop: '0.75rem', display: 'inline-block' }}>{monument.type}</span>
          <h1 className="md-title">{monument.name}</h1>
          <p className="md-district">📍 {monument.districtName} District</p>
          <div className="md-rating">{'⭐'.repeat(Math.floor(monument.rating))} {monument.rating}/5</div>
        </div>
        {monument.imageUrl && (
          <div className="md-hero-image">
            <img src={monument.imageUrl} alt={monument.name} />
          </div>
        )}
      </div>

      <section className="section section-cream">
        <div className="container md-grid">
          <div className="md-main">
            <div className="info-card">
              <h2 className="ic-title">About</h2>
              <p className="ic-text">{monument.description}</p>
            </div>
            <div className="info-card history-card">
              <h2 className="ic-title">📜 Historical Background</h2>
              <p className="ic-text history">{monument.history}</p>
            </div>
            <div className="info-card">
              <h2 className="ic-title">✨ Highlights</h2>
              <div className="highlights-list">
                {monument.highlights.map(h => <div key={h} className="highlight-item">→ {h}</div>)}
              </div>
            </div>
            {monument.nearbyAttractions && (
              <div className="info-card">
                <h2 className="ic-title">📍 Nearby Attractions</h2>
                <div className="nearby-list">
                  {monument.nearbyAttractions.map(n => {
                    const key = n.id || n.name || n;
                    const label = n.name || n;
                    if (n.id) {
                      return (
                        <Link
                          key={key}
                          to={`/monuments/${n.id}`}
                          className="nearby-tag nearby-tag-link"
                        >
                          {label}
                        </Link>
                      );
                    }
                    return (
                      <span key={key} className="nearby-tag">
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="md-sidebar">
            <div className="info-card">
              <h2 className="ic-title">🗓️ Visitor Info</h2>
              <div className="visitor-list">
                <div><strong>Timings</strong><span>{monument.timings}</span></div>
                <div><strong>Entry Fee</strong><span>{monument.entryFee}</span></div>
                <div><strong>Built By</strong><span>{monument.builtBy}</span></div>
                <div><strong>Period</strong><span>{monument.builtIn}</span></div>
                {monument.coordinates && (
                  <div><strong>Coordinates</strong><span>{monument.coordinates.lat.toFixed(4)}°N, {monument.coordinates.lng.toFixed(4)}°E</span></div>
                )}
              </div>
            </div>

            <Link to={`/districts/${monument.districtId}`} className="card sidebar-district-card">
              <h3>Explore {monument.districtName} District</h3>
              <p>See all monuments in this district</p>
              <span>View District →</span>
            </Link>

            <Link to="/map" className="card sidebar-map-card">
              <div style={{ fontSize: '2.5rem' }}>🗺️</div>
              <h3>View on Map</h3>
              <p>Find this monument on the interactive map</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

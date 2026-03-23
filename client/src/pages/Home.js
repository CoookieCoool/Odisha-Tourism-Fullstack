import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedMonuments, fetchDistricts } from '../utils/api';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchFeaturedMonuments().then(r => setFeatured(r.data.data)).catch(() => {});
    fetchDistricts().then(r => setDistricts(r.data.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-orbs">
          <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
        </div>
        <div className="hero-content">
          <p className="hero-tag">✦ Incredible India — The East Coast Gem ✦</p>
          <h1 className="hero-title">Land of <span>Temples</span><br />& Tranquility</h1>
          <p className="hero-subtitle">ଓଡ଼ିଶା — Where Ancient Glory Lives</p>
          <p className="hero-desc">Journey through centuries of Kalinga heritage — from the Sun Temple of Konark to the shores of Puri. Discover a land where art, architecture, and spirituality converge.</p>
          <div className="hero-btns">
            <Link to="/districts" className="btn btn-primary">Explore Districts</Link>
            <Link to="/map" className="btn btn-outline">Interactive Map</Link>
          </div>
        </div>
        <div className="hero-scroll"><div className="scroll-line" /><span>Scroll</span></div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        {[['30', 'Districts'], ['2000+', 'Years of History'], ['480 km', 'Coastline'], ['103+', 'Heritage Sites']].map(([n, l]) => (
          <div key={l} className="stat-item">
            <span className="stat-num">{n}</span>
            <span className="stat-label">{l}</span>
          </div>
        ))}
      </div>

      {/* About */}
      <section className="section section-cream about-section">
        <div className="container about-grid">
          <div className="about-text">
            <span className="section-tag">✦ The Kalinga Legacy ✦</span>
            <h2 className="section-title">Ancient Splendour<br />Eternal Wonder</h2>
            <div className="section-line" style={{ margin: '0 0 1.5rem' }} />
            <p>Odisha — formerly the kingdom of Kalinga — is one of the subcontinent's most ancient civilisations. The Battle of Kalinga (261 BCE) transformed Emperor Ashoka and gave Buddhism its global mission. The Eastern Ganga dynasty built the immortal Konark Sun Temple (c. 1250 CE). The Jagannath cult, one of Hinduism's oldest, began here.</p>
            <p style={{ marginTop: '1rem' }}>Today, Odisha is home to Asia's largest coastal lagoon (Chilika), rare melanistic tigers (Simlipal), the world's largest temple kitchen (Jagannath), and one of the richest concentrations of tribal cultures on earth — 62 scheduled tribes, each with their own language, art, and worldview.</p>
            <Link to="/monuments" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Discover Monuments</Link>
          </div>
          <div className="about-visual">
            <div className="visual-card vc1">☀️<div>Konark Sun Temple</div><small>c. 1250 CE</small></div>
            <div className="visual-card vc2">🦢<div>Chilika Lake</div><small>Asia's Largest Lagoon</small></div>
            <div className="visual-card vc3">🐯<div>Simlipal Reserve</div><small>Melanistic Tigers</small></div>
            <div className="visual-card vc4">🛕<div>Jagannath Temple</div><small>Sacred Dham</small></div>
          </div>
        </div>
      </section>

      {/* Featured Monuments */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">✦ Crown Jewels ✦</span>
            <h2 className="section-title">Iconic Monuments of Odisha</h2>
            <div className="section-line" />
            <p className="section-desc">The greatest treasures of Kalinga civilisation — timeless, magnificent, unforgettable</p>
          </div>
          <div className="grid-3">
            {featured.map(m => (
              <Link to={`/monuments/${m.id}`} key={m.id} className="card featured-card">
                <div className="featured-emoji">{m.emoji}</div>
                {m.badge && <span className="badge badge-saffron featured-badge">{m.badge}</span>}
                <div className="featured-body">
                  <h3 className="featured-name">{m.name}</h3>
                  <p className="featured-location">📍 {m.districtName}</p>
                  <p className="featured-desc">{m.description}</p>
                  <div className="featured-rating">{'⭐'.repeat(Math.floor(m.rating))} {m.rating}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/monuments" className="btn btn-outline">View All Monuments →</Link>
          </div>
        </div>
      </section>

      {/* Districts Preview */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">✦ Explore by Region ✦</span>
            <h2 className="section-title light">Districts of Odisha</h2>
            <div className="section-line" />
            <p className="section-desc light">Each district holds its own unique story, culture, and architectural marvels</p>
          </div>
          <div className="grid-3">
            {districts.map(d => (
              <Link to={`/districts/${d.id}`} key={d.id} className="district-preview-card">
                <div className="dpc-emoji">{d.image}</div>
                <div className="dpc-body">
                  <h3>{d.name}</h3>
                  <span className="badge badge-gold">{d.region}</span>
                  <p>{d.overview}</p>
                  <div className="dpc-meta">{d.monumentCount} Monuments · Best: {d.bestSeason}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/districts" className="btn btn-primary">All Districts →</Link>
          </div>
        </div>
      </section>

      {/* CTA Map */}
      <section className="section section-cream cta-section">
        <div className="container cta-inner">
          <div>
            <h2 className="section-title">Explore on the<br /><span style={{ color: 'var(--saffron)' }}>Interactive Map</span></h2>
            <p style={{ color: 'var(--mid)', marginTop: '1rem', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: '1.1rem', maxWidth: '480px' }}>
              Discover all monuments, temples, beaches, and nature reserves pinned across Odisha's map — click any marker for details.
            </p>
            <Link to="/map" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Open Map →</Link>
          </div>
          <div className="cta-map-preview">🗺️</div>
        </div>
      </section>
    </div>
  );
}

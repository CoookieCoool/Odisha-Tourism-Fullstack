import React, { useEffect, useState } from 'react';
import { fetchMapLocations, fetchMapCategories } from '../utils/api';
import './MapPage.css';

// Dynamically import Leaflet to avoid SSR issues
let L;

const CATEGORY_COLORS = {
  temple: '#E8651A',
  heritage: '#D4A017',
  nature: '#2E7D32',
  wildlife: '#1B5E20',
  beach: '#0288D1',
  engineering: '#5D4037',
  default: '#9C27B0'
};

const CATEGORY_EMOJIS = {
  temple: '🛕', heritage: '🏛️', nature: '🌿', wildlife: '🐯',
  beach: '🏖️', engineering: '🏗️'
};

export default function MapPage() {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    fetchMapLocations().then(r => setLocations(r.data.data)).catch(() => {});
    fetchMapCategories().then(r => setCategories(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (locations.length === 0) return;

    // Load Leaflet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      L = window.L;
      initMap();
    };
    document.head.appendChild(script);

    return () => {
      // cleanup
      const existingMap = document.getElementById('odisha-map');
      if (existingMap) existingMap.innerHTML = '';
    };
  }, [locations]);

  const initMap = () => {
    if (!window.L || !document.getElementById('odisha-map')) return;
    // Prevent double-init
    if (window._odishaMap) { window._odishaMap.remove(); }

    const map = window.L.map('odisha-map', {
      center: [20.5, 84.5],
      zoom: 7,
      zoomControl: true
    });
    window._odishaMap = map;

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    locations.forEach(loc => {
      const color = CATEGORY_COLORS[loc.category] || CATEGORY_COLORS.default;
      const icon = window.L.divIcon({
        html: `<div style="width:38px;height:38px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:3px solid white;box-shadow:0 3px 14px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(45deg);font-size:14px">${CATEGORY_EMOJIS[loc.category] || '📍'}</div></div>`,
        className: '', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -40]
      });

      window.L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Raleway,sans-serif;min-width:190px;padding:4px">
            <strong style="color:#E8651A;font-size:0.95rem;display:block;margin-bottom:4px">${loc.name}</strong>
            <span style="font-size:0.82rem;color:#666;line-height:1.5;display:block">${loc.description}</span>
            <span style="font-size:0.72rem;background:${color};color:white;padding:2px 8px;border-radius:2px;margin-top:6px;display:inline-block;text-transform:uppercase;letter-spacing:0.1em">${loc.category}</span>
          </div>
        `, { maxWidth: 230 });
    });

    setMapReady(true);
  };

  const filtered = activeCategory === 'all' ? locations : locations.filter(l => l.category === activeCategory);

  return (
    <div className="page">
      <div className="map-hero">
        <h1 className="section-title light">Interactive Map of Odisha</h1>
        <p className="section-desc light">Explore {locations.length} monuments, temples, beaches, and reserves across Odisha</p>
      </div>

      <section className="section section-dark" style={{ padding: '3rem 2rem' }}>
        <div className="container">
          <div className="map-controls">
            <div className="cat-filters">
              <button className={`cat-btn ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>All ({locations.length})</button>
              {categories.map(c => (
                <button key={c} className={`cat-btn ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>
                  {CATEGORY_EMOJIS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="map-layout">
            <div className="map-wrap">
              <div id="odisha-map" style={{ height: '560px', borderRadius: '8px' }} />
            </div>

            <div className="location-list">
              <h3 className="ll-title">Locations ({filtered.length})</h3>
              {filtered.map(loc => (
                <div key={loc.id} className={`ll-item ${selectedLocation?.id === loc.id ? 'active' : ''}`} onClick={() => setSelectedLocation(loc)}>
                  <span className="ll-emoji">{CATEGORY_EMOJIS[loc.category] || '📍'}</span>
                  <div>
                    <div className="ll-name">{loc.name}</div>
                    <div className="ll-desc">{loc.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

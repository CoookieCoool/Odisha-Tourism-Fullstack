import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchOdisha } from '../utils/api';
import './SearchPage.css';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    searchOdisha(q)
      .then(r => setResults(r.data.data))
      .catch(() => setResults([]))
      .finally(() => { setLoading(false); setSearched(true); });
  }, [q]);

  return (
    <div className="page">
      <div className="search-hero">
        <h1 className="section-title light">Search Results</h1>
        {q && <p className="section-desc light">Results for: <em>"{q}"</em></p>}
      </div>
      <section className="section section-cream">
        <div className="container">
          {loading && <div className="loading-screen"><div className="spinner" /><p className="loading-text">Searching...</p></div>}
          {searched && !loading && (
            <>
              <p className="results-count">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
              <div className="search-results">
                {results.length === 0 && (
                  <div className="no-results">
                    <div style={{ fontSize: '4rem' }}>🔍</div>
                    <h3>No results for "{q}"</h3>
                    <p>Try searching for temple names, district names, or types like "beach" or "wildlife".</p>
                  </div>
                )}
                {results.map((r, i) => (
                  <Link
                    key={i}
                    to={r.resultType === 'district' ? `/districts/${r.id}` : `/monuments/${r.id}`}
                    className="card search-result-card"
                  >
                    <div className="src-emoji">{r.emoji || r.image || (r.resultType === 'district' ? '🗺️' : '🏛️')}</div>
                    <div className="src-body">
                      <span className={`badge ${r.resultType === 'district' ? 'badge-teal' : 'badge-saffron'}`}>
                        {r.resultType === 'district' ? 'District' : r.type}
                      </span>
                      <h3 className="src-name">{r.name}</h3>
                      {r.districtName && <p className="src-location">📍 {r.districtName}</p>}
                      <p className="src-desc">{(r.overview || r.description || '').substring(0, 130)}...</p>
                    </div>
                    <div className="src-arrow">→</div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

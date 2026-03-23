import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) { navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`); setSearchVal(''); }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/districts', label: 'Districts' },
    { to: '/monuments', label: 'Monuments' },
    { to: '/map', label: 'Map' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">Odisha<span>Tourism</span></Link>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(l => (
          <li key={l.to}>
            <Link to={l.to} className={location.pathname === l.to ? 'active' : ''}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <form className="nav-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search Odisha..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>
    </nav>
  );
}

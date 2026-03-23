import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Districts from './pages/Districts';
import DistrictDetail from './pages/DistrictDetail';
import Monuments from './pages/Monuments';
import MonumentDetail from './pages/MonumentDetail';
import MapPage from './pages/MapPage';
import SearchPage from './pages/SearchPage';
import Chatbot from './components/Chatbot';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/districts" element={<Districts />} />
        <Route path="/districts/:id" element={<DistrictDetail />} />
        <Route path="/monuments" element={<Monuments />} />
        <Route path="/monuments/:id" element={<MonumentDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;

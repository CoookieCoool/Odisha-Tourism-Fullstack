import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || '/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Districts
export const fetchDistricts = () => api.get('/districts');
export const fetchDistrict = (id) => api.get(`/districts/${id}`);
export const fetchDistrictMonuments = (id) => api.get(`/districts/${id}/monuments`);

// Monuments
export const fetchMonuments = (params = {}) => api.get('/monuments', { params });
export const fetchFeaturedMonuments = () => api.get('/monuments/featured');
export const fetchMonument = (id) => api.get(`/monuments/${id}`);

// Map
export const fetchMapLocations = (params = {}) => api.get('/map/locations', { params });
export const fetchMapCategories = () => api.get('/map/categories');

// Chat
export const sendChatMessage = (message, history = []) =>
  api.post('/chat', { message, history });

// Search
export const searchOdisha = (q) => api.get('/search', { params: { q } });

export default api;

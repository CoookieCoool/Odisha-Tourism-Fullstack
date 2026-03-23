const express = require('express');
const router = express.Router();
const { mapLocations } = require('../data/odishaData');

// GET /api/map/locations
router.get('/locations', (req, res) => {
  const { category } = req.query;
  let result = mapLocations;
  if (category) result = mapLocations.filter(l => l.category === category);
  res.json({ success: true, count: result.length, data: result });
});

// GET /api/map/categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(mapLocations.map(l => l.category))];
  res.json({ success: true, data: categories });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { districts, featuredMonuments } = require('../data/odishaData');

// Flatten all monuments with district info
const allMonuments = districts.flatMap(d =>
  d.monuments.map(m => ({ ...m, districtId: d.id, districtName: d.name, districtRegion: d.region }))
);

// GET /api/monuments — all monuments
router.get('/', (req, res) => {
  const { type, district, rating } = req.query;
  let result = allMonuments;
  if (type) result = result.filter(m => m.type.toLowerCase().includes(type.toLowerCase()));
  if (district) result = result.filter(m => m.districtId === district);
  if (rating) result = result.filter(m => m.rating >= parseFloat(rating));
  res.json({ success: true, count: result.length, data: result });
});

// GET /api/monuments/featured — featured monuments
router.get('/featured', (req, res) => {
  const featured = featuredMonuments.map(f => {
    const monument = allMonuments.find(m => m.id === f.id);
    return { ...monument, badge: f.badge, priority: f.priority };
  }).sort((a, b) => a.priority - b.priority);
  res.json({ success: true, count: featured.length, data: featured });
});

// GET /api/monuments/:id — single monument
router.get('/:id', (req, res) => {
  const monument = allMonuments.find(m => m.id === req.params.id);
  if (!monument) return res.status(404).json({ success: false, error: 'Monument not found' });

  let nearby = [];
  if (Array.isArray(monument.nearbyAttractions)) {
    nearby = monument.nearbyAttractions.map(label => {
      const match = allMonuments.find(m => m.name === label);
      if (match) {
        return { id: match.id, name: match.name, type: match.type, emoji: match.emoji };
      }
      return { id: null, name: label };
    });
  }

  res.json({
    success: true,
    data: {
      ...monument,
      nearbyAttractions: nearby
    }
  });
});

module.exports = router;

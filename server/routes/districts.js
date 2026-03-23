const express = require('express');
const router = express.Router();
const { districts } = require('../data/odishaData');

// GET /api/districts — all districts (summary)
router.get('/', (req, res) => {
  const { region } = req.query;
  let result = districts;
  if (region) result = districts.filter(d => d.region.toLowerCase() === region.toLowerCase());
  const summary = result.map(({ monuments, ...d }) => ({
    ...d,
    monumentCount: monuments.length
  }));
  res.json({ success: true, count: summary.length, data: summary });
});

// GET /api/districts/:id — single district with all monuments
router.get('/:id', (req, res) => {
  const district = districts.find(d => d.id === req.params.id);
  if (!district) return res.status(404).json({ success: false, error: 'District not found' });
  res.json({ success: true, data: district });
});

// GET /api/districts/:id/monuments — monuments for a district
router.get('/:id/monuments', (req, res) => {
  const district = districts.find(d => d.id === req.params.id);
  if (!district) return res.status(404).json({ success: false, error: 'District not found' });
  res.json({ success: true, districtName: district.name, count: district.monuments.length, data: district.monuments });
});

module.exports = router;

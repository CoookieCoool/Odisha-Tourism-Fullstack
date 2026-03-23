const express = require('express');
const router = express.Router();
const { districts } = require('../data/odishaData');

const allMonuments = districts.flatMap(d =>
  d.monuments.map(m => ({ ...m, districtId: d.id, districtName: d.name }))
);

// GET /api/search?q=konark
router.get('/', (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Query must be at least 2 characters' });
  }
  const query = q.toLowerCase().trim();

  const matchedDistricts = districts
    .filter(d => d.name.toLowerCase().includes(query) || d.overview.toLowerCase().includes(query))
    .map(({ monuments, ...d }) => ({ ...d, resultType: 'district' }));

  const matchedMonuments = allMonuments
    .filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.history.toLowerCase().includes(query) ||
      m.type.toLowerCase().includes(query)
    )
    .map(m => ({ ...m, resultType: 'monument' }));

  const results = [...matchedDistricts, ...matchedMonuments];
  res.json({ success: true, query: q, count: results.length, data: results });
});

module.exports = router;

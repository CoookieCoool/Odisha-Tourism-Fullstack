require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const districtsRouter = require('./routes/districts');
const monumentsRouter = require('./routes/monuments');
const chatRouter = require('./routes/chat');
const mapRouter = require('./routes/map');
const searchRouter = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ─────────────────────────────────────────────────
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests, please try again later.' } });
const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: { error: 'Chat rate limit reached. Please wait a moment.' } });

app.use('/api/', apiLimiter);
app.use('/api/chat', chatLimiter);

// ─── Routes ───────────────────────────────────────────────────────
app.use('/api/districts', districtsRouter);
app.use('/api/monuments', monumentsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/map', mapRouter);
app.use('/api/search', searchRouter);

// ─── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ─── Serve React build in production ──────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// ─── Global Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`\n🛕  Odisha Tourism API running on http://localhost:${PORT}`);
  console.log(`📍  Environment: ${process.env.NODE_ENV}`);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here');
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here');
  const provider = hasOpenAi ? 'OpenAI' : hasAnthropic ? 'Anthropic' : 'Fallback only';
  console.log(`🤖  AI Chat: ${provider}\n`);
});

module.exports = app;

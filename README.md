# 🛕 Odisha Tourism — Full-Stack Web Application

A complete React + Node.js tourism web application for Odisha, India — featuring temples, monuments, wildlife, interactive maps, and an AI-powered chatbot.

---

## 🏗️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6           |
| Backend    | Node.js, Express.js                 |
| Map        | Leaflet.js (OpenStreetMap)          |
| AI Chatbot | Anthropic Claude API                |
| HTTP       | Axios                               |
| Security   | Helmet, CORS, Rate Limiting         |

---

## 📁 Project Structure

```
odisha-tourism/
├── server/
│   ├── index.js              # Express server entry point
│   ├── data/
│   │   └── odishaData.js     # Complete Odisha data (8 districts, 30+ monuments)
│   └── routes/
│       ├── districts.js      # GET /api/districts
│       ├── monuments.js      # GET /api/monuments
│       ├── chat.js           # POST /api/chat (AI-powered)
│       ├── map.js            # GET /api/map/locations
│       └── search.js         # GET /api/search
├── client/
│   ├── public/index.html
│   └── src/
│       ├── App.js            # Routes & layout
│       ├── styles/global.css
│       ├── utils/api.js      # Axios API calls
│       ├── components/
│       │   ├── Navbar.js     # Sticky navbar with search
│       │   └── Chatbot.js    # AI-powered chatbot widget
│       └── pages/
│           ├── Home.js       # Hero, stats, featured sections
│           ├── Districts.js  # All districts with filters
│           ├── DistrictDetail.js  # Full district with monuments
│           ├── Monuments.js  # All monuments, filter/sort
│           ├── MonumentDetail.js  # Full monument with history
│           ├── MapPage.js    # Interactive Leaflet map
│           └── SearchPage.js # Full-text search results
├── .env                      # Environment variables
├── package.json              # Root (server) dependencies
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18+ (you have v22 ✅)
- npm v8+

### 2. Clone & Install

```bash
# Install server dependencies
npm install

# Install React client dependencies
cd client && npm install && cd ..
```

### 3. Configure Environment

Edit `.env` in the root directory:

```env
PORT=5000
NODE_ENV=development
ANTHROPIC_API_KEY=your_actual_api_key_here   ← Add your key here
CLIENT_URL=http://localhost:3000
```

Get your Anthropic API key at: https://console.anthropic.com

> **Note:** The chatbot works without an API key using built-in fallback responses.

### 4. Run in Development

```bash
# From root directory — runs both server & React simultaneously
npm run dev
```

- **React app:** http://localhost:3000
- **API server:** http://localhost:5000
- **API health check:** http://localhost:5000/api/health

###Link For The Website - https://odisha-tourism-fullstack.vercel.app/
### 5. Build for Production

```bash
npm run build   # Builds React to client/build/
npm start       # Serves both React build + API on port 5000
```

---

## 📡 API Endpoints

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | `/api/health`                   | Server health check            |
| GET    | `/api/districts`                | All districts (summary)        |
| GET    | `/api/districts/:id`            | Single district + monuments    |
| GET    | `/api/districts/:id/monuments`  | Monuments for a district       |
| GET    | `/api/monuments`                | All monuments (filterable)     |
| GET    | `/api/monuments/featured`       | Top 6 featured monuments       |
| GET    | `/api/monuments/:id`            | Single monument detail         |
| GET    | `/api/map/locations`            | All map pin locations          |
| GET    | `/api/map/categories`           | Location categories            |
| POST   | `/api/chat`                     | AI chatbot (Claude API)        |
| GET    | `/api/search?q=konark`          | Full-text search               |

### Query Parameters

**Monuments:**
- `?type=Temple` — filter by type
- `?district=puri` — filter by district
- `?rating=4.5` — minimum rating

**Map:**
- `?category=temple` — filter by category (temple, heritage, nature, wildlife, beach, engineering)

---

## 🌟 Features

### Pages
- **Home** — Hero, stats, featured monuments, district previews, map CTA
- **Districts** — All 8 districts with region filters
- **District Detail** — Full info with expandable monument history
- **Monuments** — All 30+ monuments with type filters & rating sort
- **Monument Detail** — Complete history, visitor info, nearby attractions
- **Map** — Interactive Leaflet map with 18 pinned locations & category filters
- **Search** — Full-text search across districts and monuments

### AI Chatbot
- Floating button (bottom-right)
- Powered by Claude claude-sonnet-4-20250514 via Anthropic API
- Maintains conversation context (last 8 messages)
- Quick reply chips for common questions
- Graceful fallback when API key is not set
- Rate limited (20 messages/minute)

### Security
- Helmet.js security headers
- CORS configured to client origin
- Rate limiting on all API routes
- Input validation and sanitization

---

## 🗺️ Districts Covered

1. **Puri** — Jagannath Temple, Chilika Lake, Gundicha Temple, Puri Beach
2. **Khordha/Bhubaneswar** — Lingaraj, Mukteshwar, Udayagiri Caves, Dhauli
3. **Konark** — Sun Temple (UNESCO), Chandrabhaga Beach
4. **Cuttack** — Barabati Fort, Dhabaleswar Temple
5. **Sambalpur** — Hirakud Dam, Samaleswari Temple
6. **Mayurbhanj** — Simlipal Tiger Reserve, Khiching Temple
7. **Ganjam** — Tara Tarini Temple, Gopalpur Beach
8. **Koraput** — Deomali Peak, Duduma Waterfall

---

## 🛠️ Extending the App

### Add a new district
Edit `server/data/odishaData.js` — add to the `districts` array following the existing structure.

### Add more monuments
Add to the `monuments` array inside any district object in `odishaData.js`.

### Customize chatbot personality
Edit the `SYSTEM_PROMPT` in `server/routes/chat.js`.

---

## 📦 Key Dependencies

```json
Server: express, cors, helmet, morgan, compression, express-rate-limit, axios, dotenv, nodemon
Client: react, react-dom, react-router-dom, axios, leaflet, framer-motion
Dev:    concurrently, nodemon
```

---

*Built with ♥ for the love of Kalinga heritage — ଜୟ ଜଗନ୍ନାଥ 🛕*

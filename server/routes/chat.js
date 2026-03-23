const express = require('express');
const router = express.Router();
const axios = require('axios');

const SYSTEM_PROMPT = `You are "Kalinga Guide" — an expert AI travel assistant for Odisha, India. You have deep knowledge of:
- All 30 districts of Odisha and their tourist attractions
- Ancient temples: Jagannath (Puri), Konark Sun Temple (UNESCO), Lingaraj, Mukteshwar, Rajarani, Tara Tarini, Samaleswari, Khiching
- Natural wonders: Chilika Lake (Asia's largest lagoon, Irrawaddy dolphins), Simlipal Tiger Reserve (melanistic tigers), Deomali Peak, Duduma Waterfall
- Historical sites: Udayagiri & Khandagiri Caves (2nd BCE), Dhauli (Ashoka), Barabati Fort, Konark Black Pagoda
- Beaches: Puri, Chandrabhaga, Gopalpur, Pati Sonepur
- Culture: Odissi dance, Pattachitra painting, Sambalpuri textile, silver filigree (Cuttack), tribal art
- Food: Dalma, Machha Jhola, Chenna Poda (Odisha's invention!), Rasabali, Khichdi prasad
- Festivals: Rath Yatra (world's largest chariot festival), Konark Dance Festival, Magha Saptami, Nuakhai, Danda Yatra
- Tribal communities: Ho, Kondh, Bonda, Santali, Saura, Gond and their heritage
- Travel logistics: best seasons (Oct-Mar), airports (Bhubaneswar), railway hubs, accommodation

Personality: Warm, enthusiastic, knowledgeable. Use a few relevant emojis. Be specific with dates, names, and fascinating facts. Keep responses to 3-5 sentences unless more detail is requested. End responses with an invitation to ask more or a useful tip.`;

function hasRealKey(key, placeholder) {
  return Boolean(key && typeof key === 'string' && key.trim() && key.trim() !== placeholder);
}

// POST /api/chat
router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  if (message.length > 500) {
    return res.status(400).json({ success: false, error: 'Message too long (max 500 characters)' });
  }

  const openAiKeyOk = hasRealKey(process.env.OPENAI_API_KEY, 'your_openai_api_key_here');
  const anthropicKeyOk = hasRealKey(process.env.ANTHROPIC_API_KEY, 'your_anthropic_api_key_here');

  try {
    // Prefer OpenAI if configured; otherwise Anthropic; otherwise fallback.
    if (openAiKeyOk) {
      const model = (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: message.trim() }
      ];

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages,
          temperature: 0.7,
          max_tokens: 600
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          },
          timeout: 30000
        }
      );

      const reply =
        response.data?.choices?.[0]?.message?.content ||
        'I apologize, I could not process that request.';
      return res.json({ success: true, response: reply, source: 'ai' });
    }

    if (anthropicKeyOk) {
      // Format conversation history for Anthropic API
      const messages = [
        ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: message.trim() }
      ];

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          timeout: 30000
        }
      );

      const reply = response.data.content?.[0]?.text || 'I apologize, I could not process that request.';
      return res.json({ success: true, response: reply, source: 'ai' });
    }

    return res.json({
      success: true,
      response: getFallbackResponse(message),
      source: 'fallback'
    });

  } catch (err) {
    console.error('AI chat API error:', err.response?.data || err.message);
    res.json({
      success: true,
      response: getFallbackResponse(message),
      source: 'fallback'
    });
  }
});

function getFallbackResponse(msg) {
  const m = msg.toLowerCase();
  if (m.match(/konark|sun temple/)) return "☀️ The Konark Sun Temple (c. 1250 CE) is a UNESCO World Heritage Site built by King Narasimhadeva I. Shaped as a colossal chariot with 24 sundial wheels, mariners called it the 'Black Pagoda'. The Konark wheel is on India's national flag! Best visited at sunrise or sunset.";
  if (m.match(/jagannath|rath yatra|puri temple/)) return "🛕 The Jagannath Temple in Puri is one of Hinduism's four sacred dhams, built in the 12th century. The word 'juggernaut' derives from Jagannath! The temple kitchen feeds 10,000+ people daily — the world's largest. The Rath Yatra chariot festival draws millions every June/July.";
  if (m.match(/chilika|dolphin|lagoon/)) return "🦢 Chilika Lake is Asia's largest coastal lagoon (1,100 sq km) and a Ramsar Wetland. It hosts 160+ migratory bird species from Siberia and Central Asia every winter, plus rare Irrawaddy dolphins near Satapada. Best visited November to February!";
  if (m.match(/food|eat|cuisine|chenna/)) return "🍛 Odisha's star dish is Chenna Poda — burnt cheesecake that inspired the world! Must-try: Dalma (lentils with vegetables), Machha Jhola (fish curry), Rasabali, and the Jagannath Temple's Khichdi prasad. Seafood along the coast is exceptional!";
  if (m.match(/simlipal|tiger|wildlife/)) return "🐯 Simlipal Tiger Reserve is one of India's largest biosphere reserves (2,750 sq km) in Mayurbhanj. It's the only place on Earth with melanistic (pseudo-black) tigers! Also home to elephant herds and the spectacular Barehipani Waterfall (399m). Visit October to May.";
  if (m.match(/bhubaneswar|lingaraj|temple city/)) return "🛕 Bhubaneswar is the 'Temple City of India' with 700+ temples. Must-see: Lingaraj (11th century, 55m tall), Mukteshwar (gem of Odishan architecture), Udayagiri Caves (2nd BCE), and Dhauli — where Ashoka converted to Buddhism after the 261 BCE Battle of Kalinga.";
  if (m.match(/travel|visit|when|best time|how to reach/)) return "✈️ Best time to visit Odisha: October to March. Fly to Biju Patnaik International Airport, Bhubaneswar. Major rail hubs: Bhubaneswar, Puri, Cuttack, Berhampur. Rent a car for flexibility. 5 days minimum for key sites; 10+ days to explore widely. Budget travel is very affordable!";
  return "🙏 Namaste! I'm your Kalinga Guide for Odisha. Ask me about temples (Jagannath, Konark, Lingaraj), nature (Chilika, Simlipal), beaches (Puri, Gopalpur), tribal culture, festivals (Rath Yatra!), food, or travel tips. What aspect of Odisha interests you most?";
}

module.exports = router;

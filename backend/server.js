// backend/server.js
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Empire Flippers proxy ──────────────────────────────────────
const EF_BASE = 'https://api.empireflippers.com/api/v1';
const efHeaders = () => ({
  'Authorization': `Basic ${Buffer.from(process.env.EF_API_KEY + ':').toString('base64')}`,
  'Content-Type': 'application/json',
});

app.get('/listings', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query).toString();
    const r = await fetch(`${EF_BASE}/listings/?${params}`, { headers: efHeaders() });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/listings/:id', async (req, res) => {
  try {
    const r = await fetch(`${EF_BASE}/listings/${req.params.id}/`, { headers: efHeaders() });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Google Sheets email capture ────────────────────────────────
app.post('/subscribe', async (req, res) => {
  const { email, firstName = '', source = 'app_signup' } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Invalid email' });
  }

  const SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!SHEET_WEBHOOK) {
    console.log(`[FlipFinder] New subscriber (not yet saved to sheet): ${firstName} <${email}>`);
    return res.json({ success: true, note: 'logged_locally' });
  }

  try {
    const r = await fetch(SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        firstName,
        source,
        signupDate: new Date().toISOString().split('T')[0],
        signupTime: new Date().toUTCString(),
      }),
    });
    const text = await r.text();
    const ok = text.includes('success') || r.ok;
    res.json({ success: ok });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FlipFinder backend on port ${PORT}`));

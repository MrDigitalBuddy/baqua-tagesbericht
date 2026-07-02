const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.static('.'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS, PATCH');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Token direkt eingebaut — kein Environment Variable nötig
const NOTION_TOKEN = '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';
const NOTION_HEADERS = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

app.post('/notion/pages', async (req, res) => {
  console.log('POST /notion/pages', JSON.stringify(req.body).slice(0, 200));
  try {
    const r = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: NOTION_HEADERS,
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    console.log('Notion response:', r.status, JSON.stringify(data).slice(0, 200));
    res.status(r.status).json(data);
  } catch(e) {
    console.error('Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.patch('/notion/blocks/:id/children', async (req, res) => {
  console.log('PATCH /notion/blocks/', req.params.id);
  try {
    const r = await fetch(`https://api.notion.com/v1/blocks/${req.params.id}/children`, {
      method: 'PATCH',
      headers: NOTION_HEADERS,
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', token: NOTION_TOKEN.slice(0,10)+'...' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`baqua Tagesbericht Server läuft auf Port ${PORT}`));

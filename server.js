const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.static('.'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const NOTION_TOKEN = process.env.NOTION_TOKEN || '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';
const HEADERS = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

app.post('/notion/pages', async (req, res) => {
  try {
    const r = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST', headers: HEADERS, body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch('/notion/blocks/:id/children', async (req, res) => {
  try {
    const r = await fetch(`https://api.notion.com/v1/blocks/${req.params.id}/children`, {
      method: 'PATCH', headers: HEADERS, body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));

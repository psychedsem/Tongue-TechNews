import express from 'express';

const app = express();
const port = 3000;
const hackerNewsUrl = 'https://hacker-news.firebaseio.com/v0';

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/newstories.json', async (req, res) => {
  try {
    const response = await fetch(`${hackerNewsUrl}/newstories.json`);

    if (!response.ok) {
      throw new Error('Hacker News request failed');
    }

    res.json(await response.json());
  } catch {
    res.status(502).json({ error: 'Unable to reach Hacker News' });
  }
});

app.get('/api/item/:id.json', async (req, res) => {
  try {
    const response = await fetch(`${hackerNewsUrl}/item/${req.params.id}.json`);

    if (!response.ok) {
      throw new Error('Hacker News request failed');
    }

    res.json(await response.json());
  } catch {
    res.status(502).json({ error: 'Unable to reach Hacker News' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Tongue backend running on port ${port}`);
});
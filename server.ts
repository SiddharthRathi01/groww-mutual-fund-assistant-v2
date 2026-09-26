import express from 'express';
import path from 'path';
import { handleRAGQuery } from './server/rag.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    collection: process.env.CHROMA_COLLECTION || 'hdfc-mf-facts',
    database: process.env.CHROMA_DATABASE || 'hdfc-mf-rag',
    hasGemini: Boolean(process.env.GEMINI_API_KEY),
    hasChroma: Boolean(process.env.CHROMA_API_KEY),
  });
});

// Factual RAG answer endpoint
app.post('/api/answer', async (req, res) => {
  try {
    const { question, scheme } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await handleRAGQuery(question.trim(), scheme);
    return res.json(result);
  } catch (error) {
    console.error('[API] /api/answer handler failed:', error);
    return res.status(500).json({
      answer: "I'm temporarily unable to retrieve a verified answer. Please try again.",
      sourceUrl: req.body?.scheme?.sourceUrl || '',
      sourceName: 'HDFC Mutual Fund',
      isAnswered: false,
      isRefusal: false,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

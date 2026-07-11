import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import aiRouter from './routes/ai';
import crowdRouter from './routes/crowd';
import stadiumRouter from './routes/stadium';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

// ─── Middleware ────────────────────────────────────────────────────────────

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '50kb' }));

// ─── Routes ───────────────────────────────────────────────────────────────

app.use('/api/ai', aiRouter);
app.use('/api/crowd', crowdRouter);
app.use('/api/stadium', stadiumRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    provider: process.env.AI_PROVIDER ?? 'mock',
  });
});

// ─── 404 ──────────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Start ────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[StadiumPilot API] Listening on http://localhost:${PORT}`);
  console.log(`[StadiumPilot API] AI provider: ${process.env.AI_PROVIDER ?? 'mock'}`);
});

export default app;

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';
import aiRouter from './routes/ai';
import crowdRouter from './routes/crowd';
import stadiumRouter from './routes/stadium';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
const startedAt = new Date();

function requestId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function parseAllowedOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const allowedOrigins = parseAllowedOrigins(FRONTEND_ORIGIN);

// ─── Middleware ────────────────────────────────────────────────────────────

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '50kb' }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const id = requestId();
  res.setHeader('X-Request-Id', id);
  res.locals.requestId = id;
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────

app.use('/api/ai', aiRouter);
app.use('/api/crowd', crowdRouter);
app.use('/api/stadium', stadiumRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    startedAt: startedAt.toISOString(),
    timestamp: new Date().toISOString(),
    provider: process.env.AI_PROVIDER ?? 'mock',
  });
});

// ─── 404 ──────────────────────────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const requestId = res.locals.requestId as string | undefined;
  console.error('[StadiumPilot API] Unhandled error:', {
    requestId,
    message: err.message,
  });

  if (err.message === 'Origin not allowed by CORS') {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  res.status(500).json({ error: 'Internal server error', requestId });
});

// ─── Start ────────────────────────────────────────────────────────────────

const server = app.listen(PORT, () => {
  console.log(`[StadiumPilot API] Listening on http://localhost:${PORT}`);
  console.log(`[StadiumPilot API] AI provider: ${process.env.AI_PROVIDER ?? 'mock'}`);
});

// Graceful shutdown
function shutdown(): void {
  console.log('[StadiumPilot API] Shutting down gracefully...');
  server.close(() => {
    console.log('[StadiumPilot API] Server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;

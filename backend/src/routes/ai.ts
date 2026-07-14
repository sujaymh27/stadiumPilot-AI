import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { aiProvider } from '../ai/provider';

const router = Router();

const AIQuerySchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(5000),
      })
    )
    .max(20)
    .optional(),
  accessible: z.boolean().optional(),
});

router.post('/query', async (req: Request, res: Response) => {
  const parsed = AIQuerySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  try {
    const result = await aiProvider.query(parsed.data);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[AI Route]', message);

    // Detect Gemini free-tier quota exhaustion (429) and surface it clearly
    const isQuota = message.includes('429') || message.includes('quota') || message.includes('Too Many Requests');
    if (isQuota) {
      res.status(503).json({
        error: 'AI service temporarily unavailable',
        message:
          'The Gemini API quota has been reached. Please wait a moment and try again, or set AI_PROVIDER=mock in the .env file to use offline mode.',
        retryable: true,
      });
    } else {
      res.status(500).json({ error: 'AI query failed', message });
    }
  }
});

export default router;

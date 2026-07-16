import { Router, Request, Response } from 'express';
import { generateCrowd } from '../engines/crowd';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const crowd = generateCrowd();
    res.setHeader('Cache-Control', 'no-store');
    res.json(crowd);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Crowd Route]', message);
    res.status(500).json({ error: 'Failed to retrieve crowd data' });
  }
});

export default router;

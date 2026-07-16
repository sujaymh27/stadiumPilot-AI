import { Router, Request, Response } from 'express';
import { z } from 'zod';
import transportData from '../data/transport.json';
import amenitiesData from '../data/amenities.json';
import parkingData from '../data/parking.json';

const router = Router();

// Valid amenity types — mirrors the AI tool declaration
const AMENITY_TYPE_SCHEMA = z.enum(['food', 'restroom', 'medical', 'security', 'merchandise']);
const STATIC_DATA_CACHE = 'public, max-age=300, stale-while-revalidate=600';

function setStaticDataHeaders(res: Response): void {
  res.setHeader('Cache-Control', STATIC_DATA_CACHE);
}

router.get('/transport', (_req: Request, res: Response) => {
  try {
    setStaticDataHeaders(res);
    res.json(transportData);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stadium Route] /transport', message);
    res.status(500).json({ error: 'Failed to retrieve transport data' });
  }
});

router.get('/amenities', (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    setStaticDataHeaders(res);

    if (type !== undefined) {
      const parsed = AMENITY_TYPE_SCHEMA.safeParse(type);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Invalid amenity type',
          validTypes: AMENITY_TYPE_SCHEMA.options,
        });
        return;
      }
      const filtered = (amenitiesData as { type: string }[]).filter(
        (a) => a.type === parsed.data
      );
      res.json(filtered);
      return;
    }

    res.json(amenitiesData);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stadium Route] /amenities', message);
    res.status(500).json({ error: 'Failed to retrieve amenities data' });
  }
});

router.get('/parking', (_req: Request, res: Response) => {
  try {
    setStaticDataHeaders(res);
    res.json(parkingData);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stadium Route] /parking', message);
    res.status(500).json({ error: 'Failed to retrieve parking data' });
  }
});

export default router;

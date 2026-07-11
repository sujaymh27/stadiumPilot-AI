import { Router, Request, Response } from 'express';
import transportData from '../data/transport.json';
import amenitiesData from '../data/amenities.json';
import parkingData from '../data/parking.json';

const router = Router();

router.get('/transport', (_req: Request, res: Response) => {
  res.json(transportData);
});

router.get('/amenities', (req: Request, res: Response) => {
  const { type } = req.query;
  if (type && typeof type === 'string') {
    const filtered = (amenitiesData as { type: string }[]).filter(a => a.type === type);
    res.json(filtered);
    return;
  }
  res.json(amenitiesData);
});

router.get('/parking', (_req: Request, res: Response) => {
  res.json(parkingData);
});

export default router;

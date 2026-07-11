import { Router, Request, Response } from 'express';
import { generateCrowd } from '../engines/crowd';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const crowd = generateCrowd();
  res.json(crowd);
});

export default router;

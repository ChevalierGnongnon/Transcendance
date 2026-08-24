import { Router } from 'express';
import type { Request, Response } from 'express';

import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: 'ok',
      database: 'ok',
    });
  } catch (error) {
    console.error('Healthcheck failed:', error);

    return res.status(503).json({
      status: 'error',
      database: 'unavailable',
    });
  }
});

export default router;

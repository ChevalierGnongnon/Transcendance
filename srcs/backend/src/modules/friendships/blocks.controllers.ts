import type { Request, Response } from 'express';
import { Prisma } from '@/generated/prisma/client.js';

import { NotFoundError } from '../../common/errors.js';
import BlocksServices from '@/modules/friendships/blocks.services.js';

export const blockUser = async (req: Request<{ userId: string }>, res: Response) => {
  const blockedId = req.params.userId;
  const blockerId = req.userId;

  if (blockerId === blockedId)
    return res.status(400).json({ success: false, error: 'CANNOT_BLOCK_SELF' });

  try {
    if (!blockerId) throw new Error('blockerId dont exist');

    const ret = await BlocksServices.blockUser(blockerId, blockedId);

    return res.status(201).json(ret);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(409).json({
          code: 'ALREADY_BLOCKED',
          message: 'This user is already blocked.',
        });
      }
      if (error.code === 'P2003') {
        res.status(422).json({
          code: 'USER_NOT_FOUND',
          message: 'One of the users does not exist.',
        });
      }
    }

    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const unblockUser = async (req: Request<{ userId: string }>, res: Response) => {
  const blockedId = req.params.userId;
  const blockerId = req.userId;

  if (blockerId === blockedId)
    return res.status(400).json({ success: false, error: 'CANNOT_UNBLOCK_SELF' });

  try {
    if (!blockerId) throw new Error('blockerId dont exist');

    await BlocksServices.unblockUser(blockerId, blockedId);

    return res.status(204).json();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'BLOCK_NOT_FOUND' });
    }
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

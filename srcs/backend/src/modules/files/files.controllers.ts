import type { Request, Response } from 'express';

import FileService from './files.services.js';
import { NotFoundError } from '../../common/errors.js';

export async function getDefaultAvatars(req: Request, res: Response) {
  try {
    const avatars = await FileService.getDefaultAvatars();

    return res.status(200).json(avatars);
  } catch (error) {
    console.error('Get default avatars error:', error);

    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'Default avatars not found' });
    }
  }
  return res.status(500).json({
    error: 'Internal Server Error',
  });
}

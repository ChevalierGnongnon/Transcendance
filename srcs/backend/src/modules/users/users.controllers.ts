import type { Request, Response } from 'express';
import UsersService from './users.services.ts';
import { NotFoundError } from '../../common/errors.js';

export async function getMyProfile(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const user = await UsersService.getUserById(userId);

    console.log(user);

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get user by id error:', error);

    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'USER_NOT_FOUND' });
    }

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export function getUserByPseudo(req: Request, res: Response) {
  // const { pseudo } = req.params;
}

export async function updateProfilePhoto(req: Request, res: Response) {
  const userId = req.userId!;
  const avatarId = req.body.avatar;

  try {
    await UsersService.updateProfilePhoto(userId, avatarId);
    return (res.status(200).json({success:true}))
  }
  catch (error) {
    if (error instanceof Error && error.message === 'INVALID_AVATAR'){
      return res.status(400).json({ error: 'INVALID_AVATAR' });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}

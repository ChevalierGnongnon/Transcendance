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
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}

export function getUserByPseudo(req: Request, res: Response) {
  // const { pseudo } = req.params;
}

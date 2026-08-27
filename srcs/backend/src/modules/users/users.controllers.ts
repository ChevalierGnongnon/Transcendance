import type { Request, Response } from 'express';
import UsersService from './users.services.ts';
import { NotFoundError } from '../../common/errors.js';

export async function getMyProfile(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const user = await UsersService.getUserById(userId);

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

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await UsersService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const user = await UsersService.getUserById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}
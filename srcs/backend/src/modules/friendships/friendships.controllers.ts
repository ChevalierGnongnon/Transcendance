import type { Request, Response } from 'express';
import { NotFoundError } from '../../common/errors.ts';
import FriendshipsServices from './friendships.services.ts';

export const createFriendship = async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = req.userId;

  if (friendId === userId)
    return res.status(400).json({ success: false, error: 'CANNOT_ADD_SELF' });

  try {
    if (!userId) throw new Error('userId dont exist');

    const ret = await FriendshipsServices.creatFriendship(userId, friendId);

    if (!ret.ok) return res.status(409).json({ success: false, error: ret.error });

    return res.status(201).json(ret);
  } catch (error) {
    console.error('Error creat friendship', error);

    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const getFriendships = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    if (!userId) throw new Error('userId dont exist');

    const friendships = await FriendshipsServices.getFriendships(userId);

    return res.status(200).json(friendships);
  } catch (error) {
    console.error('Error getFriendships', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const updateFriendships = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.userId;

  const status = req.body.status as FriendshipStatus;

  try {
    if (!userId) throw new Error('userId dont exist');

    const updated = await FriendshipsServices.updateFriendships(userId, id, status);
    console.log(updated);

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error getFriendships', error);
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'FRIENDSHIP_NOT_FOUND' });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const deleteFriend = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await FriendshipsServices.deleteFriendship(id);

    return res.status(200).json({ success: true, deleted });
  } catch (error) {
    console.error('Error getFriendships', error);
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'FRIENDSHIP_NOT_FOUND' });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
};

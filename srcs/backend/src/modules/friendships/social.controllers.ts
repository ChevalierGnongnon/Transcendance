import type { Request, Response } from 'express';
import SocialServices from './social.services.js';

export const sendFriendRequest = async (req: Request<{ userId: string }>, res: Response) => {
  const senderId = req.userId;
  const receiverId = req.params.userId;

  if (senderId === receiverId)
    return res.status(400).json({ success: false, error: 'CANNOT_FRIEND_SELF' });

  try {
    if (!senderId) throw new Error('senderId dont exist');

    // await SocialServices.(blockerId, blockedId);

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const acceptFriendRequest = async (req: Request<{ id: string }>, res: Response) => {
  const friendRequestId = req.id;
  const receiverId = req.params.userId;

  if (senderId === receiverId)
    return res.status(400).json({ success: false, error: 'CANNOT_FRIEND_SELF' });

  try {
    if (!senderId) throw new Error('senderId dont exist');

    // await SocialServices.(blockerId, blockedId);

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const getSocialState = async (req: Request<{ userId: string }>, res: Response) => {
  const userId = req.userId;

  try {
    if (!userId) throw new Error('userId dont exist');

    const state = await SocialServices.getSocialState(userId);

    return res.status(201).json(state);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

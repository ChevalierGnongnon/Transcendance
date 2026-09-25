import type { Request, Response } from 'express';
import SocialServices from './social.services.js';
import FriendRequestServices from './friend-request.services.js';
import FriendshipsServices from './friendships.services.js';
import { ConflictError, ForbiddenRightsError, NotFoundError } from '@/common/errors.js';
import { Prisma } from '@/generated/prisma/client.js';

export const sendFriendRequest = async (req: Request<{ userId: string }>, res: Response) => {
  const senderId = req.userId;
  const receiverId = req.params.userId;

  if (senderId === receiverId)
    return res.status(400).json({ success: false, error: 'CANNOT_FRIEND_SELF' });

  if (!senderId) return res.status(400).json({ success: false, error: 'SENDERID_ISEMPTY' });

  try {
    const request = await FriendRequestServices.sendFriendRequest(senderId, receiverId);

    return res.status(201).json(request);
  } catch (error) {
    if (error instanceof ConflictError) {
      return res.status(409).json({ error: 'CONFLICT' });
    }
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const deleteFriendRequest = async (req: Request<{ id: string }>, res: Response) => {
  const requestId = req.params.id;

  try {
    await FriendRequestServices.deleteFriendRequest(requestId);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const acceptFriendRequest = async (req: Request<{ id: string }>, res: Response) => {
  const friendRequestId = req.params.id;
  const currentUserId = req.userId;

  if (!friendRequestId)
    return res.status(400).json({ success: false, error: 'FRIENDREQUESTID_ISEMPTY' });

  try {
    if (!currentUserId) throw new Error('Current userId is Empty');

    const request = await FriendRequestServices.acceptFriendRequest(friendRequestId, currentUserId);

    return res.status(201).json(request);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    if (error instanceof ForbiddenRightsError) {
      return res.status(403).json({ success: false, error: 'FORBIDDEN' });
    }
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const getSocialState = async (req: Request<{ userId: string }>, res: Response) => {
  const userId = req.userId;

  try {
    if (!userId) throw new Error('userId dont exist');

    const state = await SocialServices.getSocialState(userId);

    return res.status(200).json(state);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    }
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const removeFriendship = async (req: Request<{ friendshipId: string }>, res: Response) => {
  const friendshipId = req.params.friendshipId;
  const userId = req.userId;

  try {
    if (!userId) throw new Error('userId dont exist');

    await FriendshipsServices.removeFriendship(friendshipId, userId);

    return res.status(204).json();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'FRIENDSHIP_NOT_FOUND' });
    }

    if (error instanceof ForbiddenRightsError) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const getRelationship = async (req: Request<{ userId: string }>, res: Response) => {
  const otherUserId = req.params.userId;
  const currentUserId = req.userId!;

  if (!otherUserId) return res.status(400).json({ success: false, error: 'USERID_ISEMPTY' });

  try {
    if (!currentUserId) throw new Error('userId dont exist');

    const relationship = await SocialServices.getRelationship(currentUserId, otherUserId);

    return res.status(200).json(relationship);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    }

    if (error instanceof ForbiddenRightsError) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }

    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  const currentUserId = req.userId!;

  try {
    if (!currentUserId) throw new Error('userId dont exist');

    const friends = await SocialServices.getFriends(currentUserId);

    return res.status(200).json(friends);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    }

    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};

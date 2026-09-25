import { prisma } from '@/lib/prisma.js';

import { normalizePair, type Relationship } from './social.utils.js';
import { ConflictError, ForbiddenRightsError, NotFoundError } from '@/common/errors.js';

class FriendRequestServices {
  async sendFriendRequest(senderId: string, receiverId: string) {
    return await prisma.$transaction(async (tx) => {
      const exist = await tx.user.findFirst({
        where: {
          id: senderId,
          OR: [
            { sentFriendRequests: { some: { receiverId: receiverId } } },
            { receivedFriendRequests: { some: { senderId: receiverId } } },
            { friendshipsAsUser: { some: { friendId: receiverId } } },
            { friendshipsAsFriend: { some: { userId: receiverId } } },
            { blocksCreated: { some: { blockedId: receiverId } } },
            { blocksReceived: { some: { blockerId: receiverId } } },
          ],
        },
      });

      if (exist) {
        throw new ConflictError('Cannot send friend request: users is already relationship');
      }

      const friendRequest = await tx.friendRequest.create({
        data: { senderId, receiverId },
        select: {
          id: true,
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              pseudo: true,
              profilePhotoId: true,
            },
          },
          createdAt: true,
        },
      });

      return friendRequest;
    });
  }

  async acceptFriendRequest(requestId: string, currentUserId: string) {
    return await prisma.$transaction(async (tx) => {
      const request = await tx.friendRequest.delete({
        where: { id: requestId },
      });

      if (!request) throw new NotFoundError('friendRequest not found');

      if (request.receiverId !== currentUserId) {
        throw new ForbiddenRightsError('Only receiver can accept friend request');
      }

      const [userId, friendId] = normalizePair(request.senderId, request.receiverId);

      const friendship = await tx.friendship.create({
        data: {
          userId: userId,
          friendId: friendId,
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              pseudo: true,
              profilePhotoId: true,
            },
          },
          friend: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              pseudo: true,
              profilePhotoId: true,
            },
          },
          createdAt: true,
        },
      });
      const otherUser = friendship.user.id === currentUserId ? friendship.friend : friendship.user;
      return {
        id: friendship.id,
        friend: otherUser,
        createdAt: friendship.createdAt,
      };
    });
  }

  async deleteFriendRequest(requestId: string) {
    await prisma.friendRequest.deleteMany({
      where: { id: requestId },
    });
  }
}

export default new FriendRequestServices();

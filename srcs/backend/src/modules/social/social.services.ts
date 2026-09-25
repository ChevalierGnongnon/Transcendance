import { prisma } from '@/lib/prisma.js';

import { normalizePair, type Relationship } from './social.utils.js';
import { NotFoundError } from '@/common/errors.js';

class SocialServices {
  async getSocialState(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        friendshipsAsUser: {
          select: {
            id: true,
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
        },
        friendshipsAsFriend: {
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
            createdAt: true,
          },
        },
        receivedFriendRequests: {
          select: {
            id: true,
            sender: {
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
        },
        sentFriendRequests: {
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
        },
        blocksCreated: {
          select: {
            id: true,
            blocked: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                pseudo: true,
                profilePhotoId: true,
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundError('User not found');

    const friends = [
      ...user?.friendshipsAsFriend.map(({ user, ...rest }) => ({ ...rest, friend: user })),
      ...user?.friendshipsAsUser,
    ];

    return {
      friends: friends,
      incomingRequests: user?.receivedFriendRequests,
      outgoingRequests: user?.sentFriendRequests,
      blockedUsers: user?.blocksCreated,
    };
  }

  async getRelationship(currentUserId: string, otherUserId: string) {
    const user = await prisma.user.findFirst({
      where: { id: currentUserId },
      select: {
        friendshipsAsUser: {
          where: { friendId: otherUserId },
          select: { id: true },
          take: 1,
        },
        friendshipsAsFriend: {
          where: { userId: otherUserId },
          select: { id: true },
          take: 1,
        },
        sentFriendRequests: {
          where: { receiverId: otherUserId },
          select: { id: true },
          take: 1,
        },
        receivedFriendRequests: {
          where: { senderId: otherUserId },
          select: { id: true },
          take: 1,
        },
        blocksCreated: {
          where: { blockedId: otherUserId },
          select: { id: true },
          take: 1,
        },
        blocksReceived: {
          where: { blockerId: otherUserId },
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!user) throw new Error('User is null');

    return {
      isFriend: user.friendshipsAsUser.length > 0 || user.friendshipsAsFriend.length > 0,
      requestSent: user.sentFriendRequests.length > 0,
      requestReceived: user.receivedFriendRequests.length > 0,
      blockedByMe: user.blocksCreated.length > 0,
      blockedMe: user.blocksReceived.length > 0,
    };
  }

  async getFriends(currentUserId: string) {
    const user = await prisma.user.findFirst({
      where: { id: currentUserId },
      select: {
        friendshipsAsUser: {
          select: {
            friend: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                pseudo: true,
                profilePhotoId: true,
              },
            },
          },
        },
        friendshipsAsFriend: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                pseudo: true,
                profilePhotoId: true,
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundError('User not found');

    const friends = [
      ...user?.friendshipsAsFriend.map(({ user, ...rest }) => ({ ...rest, friens: user })),
      ...user?.friendshipsAsUser,
    ];

    return friends;
  }

  async removeFriend(currentUserId: string, otherUserId: string) {
    const [userId, friendId] = normalizePair(currentUserId, otherUserId);

    const ret = await prisma.friendship.deleteMany({
      where: { userId, friendId },
    });

    if (ret.count === 0) {
      throw new NotFoundError('Friendship not found');
    }

    return { count: ret.count };
  }
}

export default new SocialServices();

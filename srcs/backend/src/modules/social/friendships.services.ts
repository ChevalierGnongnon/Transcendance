import { prisma } from '@/lib/prisma.js';

import { ForbiddenRightsError } from '@/common/errors.js';

class FriendshipsServices {
  async removeFriendship(friendshipId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const friendship = await tx.friendship.delete({
        where: { id: friendshipId },
      });

      const isMember = friendship.userId === userId || friendship.friendId === userId;

      if (!isMember) {
        throw new ForbiddenRightsError('Only user can remove friendship');
      }
      return { success: true };
    });
  }

  async getFriendsId(userId: string) {
    const friends = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        friendshipsAsUser: {
          select: {
            id: true,
          },
        },
        friendshipsAsFriend: {
          select: {
            id: true,
          },
        },
      },
    });

    const friendIds = [
      ...(friends?.friendshipsAsUser ?? []),
      ...(friends?.friendshipsAsFriend ?? []),
    ].map(({ id }) => id);

    return friendIds;
  }
}

export default new FriendshipsServices();

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
}

export default new FriendshipsServices();

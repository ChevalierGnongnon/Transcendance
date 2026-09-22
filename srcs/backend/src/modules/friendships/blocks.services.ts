import { prisma } from '@/lib/prisma.js';
import { Prisma } from '@/generated/prisma/client.js';

import { NotFoundError } from '@/common/errors.js';

function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

class BlocksServices {
  async blockUser(blockerId: string, blockedId: string) {
    const [userId, friendId] = normalizePair(blockerId, blockedId);
    return await prisma.$transaction(async (tx) => {
      const block = await tx.block.create({
        data: { blockerId: blockerId, blockedId: blockedId },
      });
      await tx.friendship.deleteMany({
        where: { userId: userId, friendId: friendId },
      });
      await tx.friendRequest.deleteMany({
        where: {
          OR: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
          ],
        },
      });

      return block;
    });
  }

  async unblockUser(blockerId: string, blockedId: string) {
    await prisma.block.deleteMany({
      where: { blockerId: blockerId, blockedId: blockedId },
    });
  }
}

export default new BlocksServices();

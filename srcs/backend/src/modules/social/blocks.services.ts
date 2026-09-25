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
          createdAt: true,
        },
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
    const ret = await prisma.block.deleteMany({
      where: { blockerId, blockedId },
    });

    if (ret.count === 0) {
      throw new NotFoundError('Block not found');
    }
  }
}

export default new BlocksServices();

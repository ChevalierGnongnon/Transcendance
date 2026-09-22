import { prisma } from '@/lib/prisma.js';

class FriendRequestServices {
  async sendFriendRequest(senderId: string, receiverId: string) {
    return await prisma.$transaction(async (tx) => {
      const blocked = await tx.block.findFirst({
        where: {
          OR: [
            { blockerId: senderId, blockedId: receiverId },
            { blockerId: receiverId, blockedId: senderId },
          ],
        },
      });

      if (blocked) {
        throw new Error('Cannot send friend request: user is blocked');
      }

      const incomingRequest = await tx.friendRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: receiverId,
            receiverId: senderId,
          },
        },
      });

      if (incomingRequest) {
        throw new Error('Cannot send friend request: incoming request already exists');
      }

      const outgoingRequest = await tx.friendRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId,
            receiverId,
          },
        },
      });

      if (outgoingRequest) {
        throw new Error('Cannot send friend request: request already sent');
      }

      const friendRequest = await tx.friendRequest.create({
        data: { senderId, receiverId },
      });

      return friendRequest;
    });
  }
}

export default new FriendRequestServices();

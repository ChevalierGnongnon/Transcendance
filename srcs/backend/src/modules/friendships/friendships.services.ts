import { prisma } from '@/lib/prisma.js';
import { FriendshipStatus, Prisma } from '@/generated/prisma/client.js';

import { NotFoundError } from '@/common/errors.js';

class FriendshipsServices {
  async creatFriendship(userId: string, receiverId: string) {
    return await prisma.$transaction(
      async (tx) => {
        const friendshipExist = await tx.friendship.findFirst({
          where: {
            status: 'accepted',
            OR: [
              { userId: userId, friendId: receiverId },
              { userId: receiverId, friendId: userId },
            ],
          },
        });

        if (friendshipExist) return { ok: false, error: 'ALREADY_FRIENDS' };

        const existing = await tx.friendship.findFirst({
          where: {
            status: 'pending',
            OR: [
              { userId: userId, friendId: receiverId },
              { userId: receiverId, friendId: userId },
            ],
          },
        });

        if (existing) {
          return existing.userId === userId
            ? { ok: false, error: 'ALREADY_SENT' }
            : { ok: false, error: 'INCOMING_EXISTS' };
        }

        const friendship = await tx.friendship.create({
          data: { userId: userId, friendId: receiverId },
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
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
          },
        });

        return { ok: true, friendship };
      },

      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 5000,
      }
    );
  }

  async getFriendships(userId: string) {
    const friendships = await prisma.friendship.findMany({
      where: { OR: [{ userId: userId }, { friendId: userId }] },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
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
      },
    });

    const rank = (f: (typeof friendships)[number]): number => {
      if (f.status === 'accepted') return 0;
      if (f.status === 'pending' && f.friend.id === userId) return 1;
      if (f.status === 'pending' && f.user.id === userId) return 2;
      if (f.status === 'blocked') return 3;
      return 4;
    };

    return friendships.sort((a, b) => {
      const d = rank(a) - rank(b);
      return d !== 0 ? d : b.createdAt.getTime() - a.createdAt.getTime();
    });

    // return friendships;
  }

  async updateFriendships(userId: string, friendshipId: string, status: FriendshipStatus) {
    const exist = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!exist) throw new NotFoundError('Friendships with tis id not exist');

    if (status === FriendshipStatus.refused || status === FriendshipStatus.cancelled) {
      await prisma.friendship.delete({
        where: { id: friendshipId },
        select: {
          id: true,
        },
      });
      return { id: friendshipId, status: status };
    }

    if (status === FriendshipStatus.accepted || status === FriendshipStatus.blocked) {
      const updated = await prisma.friendship.update({
        where: { id: friendshipId },
        data: {
          status: status,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          status: true,
          updatedAt: true,
        },
      });
      return updated;
    }
  }

  async deleteFriendship(friendshipId: string) {
    try {
      const id = await prisma.friendship.delete({
        where: { id: friendshipId },
        select: {
          id: true,
        },
      });

      return id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Friendships with this id not exist');
      }
      throw error;
    }
  }

  //for online status, we only need friends id
  async getFriendsId(userId: string){
    const friendship = await prisma.friendship.findMany({
      where: { 
        OR: [
          { userId: userId }, 
          { friendId: userId }
        ] ,
        AND: [
          { status: "accepted"}
        ]
      },
      select: {
        id: true,
        
        user:{
          select: {
            id: true,
          }
        },
        friend: {
          select: {
            id: true,
          },
        },
      },
    })
    return (friendship.map(f => f.user.id === userId ? f.friend.id : f.user.id));

  }
}

export default new FriendshipsServices();

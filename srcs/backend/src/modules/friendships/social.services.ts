import { prisma } from '@/lib/prisma.js';

function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

type Relationship = {
  isFriend: boolean;
  requestSent: boolean;
  requestReceived: boolean;
  blockedByMe: boolean;
  blockedMe: boolean;
};

class SocialServices {
  async getSocialState(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        friendshipsAsUser: {
          include: {
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
          include: {
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

        sentFriendRequests: {
          include: {
            receiver: {
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

        receivedFriendRequests: {
          include: {
            sender: {
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

        blocksCreated: {
          include: {
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
    return user;
  }

  async getRelationship(currentUserId: string, otherUseId: string) {}
}

export default new SocialServices();

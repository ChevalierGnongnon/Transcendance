import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../common/errors.js';

class UsersService {
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        isDeleted: false,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        pseudo: true,

        profilePhoto: {
          select: {
            name: true,
          },
        },
      },
    });
    

    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getAllUsers() {
    const users = prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!users) {
      throw new NotFoundError('User not found');
    }
    return users;
  }
}

export default new UsersService();

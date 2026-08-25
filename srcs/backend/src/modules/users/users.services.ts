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
}

export default new UsersService();

import { prisma } from '../../lib/prisma.ts';
import { NotFoundError } from '../../common/errors.js';

class FileService {
  async getDefaultAvatars() {
    const avatars = await prisma.file.findMany({
      where: {
        type: 'default_avatar',
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (avatars.length === 0) {
      throw new NotFoundError('Default avatars not found');
    }
    return avatars;
  }
}

export default new FileService();

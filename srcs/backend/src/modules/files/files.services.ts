import { prisma } from '../../lib/prisma.ts';
import { NotFoundError } from '../../common/errors.js';
import { UnsupportedFileTypeError } from '../../common/errors.js';
import { avatarWhiteList, messageFileWhiteList } from './files.middlewares.ts';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import fs from 'fs';

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
  async createFile(fileBuffer: Buffer,  userId: string, type: string) {
    const fileType = await fileTypeFromBuffer(fileBuffer);
    
    if (fileType === undefined)
      throw new UnsupportedFileTypeError('Unsupported file type by fileTypeFromBuffer()');
    else {
      if (type === 'profile_photo' && avatarWhiteList.includes(fileType.mime)){
        const result = await sharp(fileBuffer).toFormat('webp').toBuffer();
        const id = randomUUID();
        const fileName = `${id}.webp`;
        fs.writeFileSync(`/app/uploads/${fileName}`, result)
      }
      else if (type === 'message' && messageFileWhiteList.includes(fileType.mime)){
        
      }
      else {
        throw new UnsupportedFileTypeError('File type is not in whitelist');
      }
    }
  }
}

export default new FileService();

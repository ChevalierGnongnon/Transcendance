import { prisma } from '../../lib/prisma.ts';
import { ForbiddenRightsError, InvalidAuthentificationError, NotFoundError } from '../../common/errors.js';
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
      
        fs.writeFileSync(`/app/uploads/${fileName}`, result);

        await prisma.$transaction([
          prisma.file.create({
            data:{
              id : id,
              name: fileName,
              type: type,
              userId: userId,
              mimeType: 'image/webp', 
              expiresAt: null,
            }
          }),
          prisma.user.update({
            where:{
              id: userId,
            },
            data:{
              profilePhotoId: id,
            }
          })
        ])
        return(id);
      }
      else if (type === 'message' && messageFileWhiteList.includes(fileType.mime)){
        let bufferToWrite = fileBuffer;
        let extension = fileType.ext;
        const expiredDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        if (avatarWhiteList.includes(fileType.mime) || fileType.mime === 'image/gif') {
          bufferToWrite = await sharp(fileBuffer).toFormat('webp').toBuffer();
          extension = 'webp';
        }

        const id = randomUUID();
        const fileName = `${id}.${extension}`;
        
        fs.writeFileSync(`/app/uploads/${fileName}`, bufferToWrite);
        
        await prisma.file.create({
          data:{
            id : id,
            name: fileName,
            type: type,
            userId: userId,
            mimeType: extension === 'webp' ? 'image/webp' : fileType.mime,
            expiresAt: expiredDate,
          }
        })
        return(id);
      }
      else {
        throw new UnsupportedFileTypeError('File type is not in whitelist');
      }
      
    }
  }
  async deleteFile(fileId: string, requesterId: string){
    const file = await prisma.file.findUnique({
      where:{
        id: fileId,
      }
    });
    if (file === null)
      throw new NotFoundError('File not found');
    if (file.userId !== requesterId)
      throw new ForbiddenRightsError('User doesn\'t have the rights for this file');
    if (file.type === 'default_avatar')
      throw new ForbiddenRightsError('Default avatars can\'t be deleted');
      await prisma.file.delete({
        where:{
          id: fileId,
      }
    })
    try {
      fs.unlinkSync(`/app/uploads/${file.name}`);
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code !== 'ENOENT') {
        throw err;
      }
    }
  }
  async getFileDownload(fileId: string, requesterId?: string){
    const file = await prisma.file.findUnique({
      where:{
        id: fileId, 
      }
    });
    if (file === null)
      throw new NotFoundError('File not found');
    if (file.type === 'default_avatar')
      return (file);
    if (requesterId === undefined)
      throw new InvalidAuthentificationError('Invalid user id');
    if (file.type === 'profile_photo')
      return (file);
    if (file.type === 'message'){
      if (file.userId !== requesterId)
        throw new ForbiddenRightsError('User doesn\'t have the rights for this file');
    }
    return (file);
  }
}

export default new FileService();

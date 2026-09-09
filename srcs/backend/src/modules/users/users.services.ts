import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../common/errors.js';
import FileService  from '../files/files.services.ts';
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
            id: true,
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
  async updateProfilePhoto(UserId: string, FileId: string){
    const oldPpId = await prisma.user.findUnique({
      where:{
        id: UserId,
      },
      select: {
        profilePhotoId: true,
      }
    })
    const checkNewFileId = await prisma.file.findUnique({
      where:{
        id: FileId,
      }
    });
    if (!checkNewFileId || checkNewFileId.type !== 'default_avatar') {
      throw new Error('INVALID_AVATAR');
    }
    
    await prisma.user.update({ 
      where: { 
        id: UserId
      },
      data: { 
        profilePhotoId: FileId
      }
    })
  
    if (oldPpId?.profilePhotoId){
      try {
        await FileService.deleteFile(oldPpId.profilePhotoId, UserId);
      } catch (err) {

      }
    }
  }
  async searchUsers(input: string, currentUserId: string){
    const res = await prisma.user.findMany({
      where:{
        isDeleted: false,
        id: {
          not: currentUserId,
        },
        OR:[{
            lastName : {
              contains: input
            }
          },
          {
            firstName:{
              contains: input
            }
          },
          {
            pseudo: {
              contains: input
            }
          }
        ]
      },
      select:{
        id: true,
        pseudo: true,
        firstName: true, 
        lastName: true,
        profilePhoto: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        pseudo: "asc", 
      },
      take: 20,
      
    })
    return (res);
  }
}

export default new UsersService();

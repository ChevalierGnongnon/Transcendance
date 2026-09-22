import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../common/errors.js';
import FileService  from '../files/files.services.ts';
import { updateProfilePhoto } from './users.controllers.ts';
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


  async getAllUsers() {
    const users = await prisma.user.findMany({
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
              startsWith: input
            }
          },
          {
            firstName:{
              startsWith: input
            }
          },
          {
            pseudo: {
              startsWith: input
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
  async getUserInfo(pseudo: string){
    const res = await prisma.user.findUnique({
      where: {
        pseudo: pseudo,
      }, 
      select: {
        pseudo: true,
        firstName: true, 
        lastName: true,
        profilePhoto: {
          select: {
            id: true,
            name: true,
          },
        },
      }
    })
    if (!res)
      throw new NotFoundError('USER_NOT_FOUND')
    return (res);
  }
  async updateLastName(userId: string, newLastName: string){
    await prisma.user.update({ 
      where: { 
        id: userId,
      },
      data: { 
        lastName: newLastName,
      },
    })
  }

  async updateFirstName(userId: string, newFirstName: string){
    await prisma.user.update({ 
      where: { 
        id: userId,
      },
      data: { 
        firstName: newFirstName,
      },
    })
  }
  async updatePseudo(userId: string, newPseudo: string){
    const res = await prisma.user.findUnique({
      where:{
        pseudo: newPseudo,
      }
    })
    if (!res){
      await prisma.user.update({ 
        where: { 
          id: userId,
        },
        data: { 
          pseudo: newPseudo,
        },
      })
    }
    else
      throw new Error('PSEUDO_EXISTS');
  }
}



export default new UsersService();

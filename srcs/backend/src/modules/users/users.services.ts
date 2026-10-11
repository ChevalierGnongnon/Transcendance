import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../common/errors.js';
import FileService  from '../files/files.services.ts';

class UsersService {
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
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
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true
      },
      take: 20,
    });
    if (!users) {
      throw new NotFoundError('User not found');
    }
    return users;
  }
  async updateProfilePhoto(userId: string, fileId: string){
    const oldPpId = await prisma.user.findUnique({
      where:{
        id: userId,
      },
      select: {
        profilePhotoId: true,
      }
    })
    const checkNewFileId = await prisma.file.findUnique({
      where:{
        id: fileId,
      }
    });

    if (!checkNewFileId || checkNewFileId.type !== 'default_avatar') {
      throw new Error('INVALID_AVATAR');
    }
    
    await prisma.user.update({ 
      where: { 
        id: userId
      },
      data: { 
        profilePhotoId: fileId
      }
    })
  
    if (oldPpId?.profilePhotoId){
      try {
        await FileService.deleteFile(oldPpId.profilePhotoId, userId);
      } catch (err) {

      }
    }
  }
  async searchUsers(input: string, currentUserId: string){
    const res = await prisma.user.findMany({
      where:{
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
      }
    })
    if (!res)
      throw new NotFoundError('USER_NOT_FOUND')
    return (res);
  }
  async updateLastName(userId: string, newLastName: string){
    const userToUpdate = await prisma.user.findUnique({
      where:{
        id: userId,
      },
      select:{
        lastName:true
      }
    })
    if (!userToUpdate)
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    if (userToUpdate.lastName !== newLastName){
      await prisma.user.update({ 
        where: { 
          id: userId,
        },
        data: { 
          lastName: newLastName,
        },
      })
    }
   
  }

  async updateFirstName(userId: string, newFirstName: string){
    const userToUpdate = await prisma.user.findUnique({
      where:{
        id: userId,
      },
      select:{
        firstName:true
      }
    })
    if (!userToUpdate)
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    if (userToUpdate.firstName !== newFirstName){
      await prisma.user.update({ 
        where: { 
          id: userId,
        },
        data: { 
          firstName: newFirstName,
        },
      })
    }
  }

  async updatePseudo(userId: string, newPseudo: string){
    const res = await prisma.user.findUnique({
      where:{
        pseudo: newPseudo,
      },
      select:{
        id: true,
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
      return ;
    }
    if (res.id !== userId)
      throw new Error('PSEUDO_EXISTS');
      
  }
}



export default new UsersService();

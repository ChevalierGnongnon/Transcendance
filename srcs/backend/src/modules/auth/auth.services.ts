import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../../lib/prisma.js';
import { NotFoundError, UnsupportedFileTypeError } from '../../common/errors.js';
import FileService from '../files/files.services.ts'
import { fileTypeFromBuffer } from 'file-type';
import { avatarWhiteList } from '../files/files.middlewares.ts';
import { userInfo } from 'os';

const DUMMY_HASH = bcrypt.hashSync('pjm5UrwVZgJxXa3eyc79dZsNeZcJsFwL0l1U81521XjMv3FXvw8NIVkHQuIpk4jmpAuA77fD', 12);

function createToken(userId: string){
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET!, {expiresIn: 24 * 60 * 60});
  return (token);
}


class authService {
  async checkUserExists(userId: string){
    const check = await prisma.user.findUnique({
      where : {
        id : userId,
      },
      select:{
        id : true,
      }
    })
    if (!check)
      return (false);
    return (true);
  }
  async login(login: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { pseudo: login }],
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      throw new NotFoundError('User not found');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      throw new NotFoundError('Password not correct');
    }
    const token = createToken(user.id);
    return {
      token,
      userId: user.id,
    };
  }
  async registration(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birthdate: string | Date;
    pseudo: string;
    avatar: string | null;
    fileBuffer?: Buffer
  }){
    const { first_name, last_name, email, password, birthdate, pseudo, avatar } = userData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('EMAIL_EXISTS');
    }

    const existingPseudo = await prisma.user.findUnique({
      where: { pseudo }
    })
    if (existingPseudo) {
      throw new Error('PSEUDO_EXISTS');
    }
    if (avatar){
      const checkNewFileId = await prisma.file.findUnique({
        where:{
          id: avatar,
        }
      });
      if (!checkNewFileId || checkNewFileId.type !== 'default_avatar') {
        throw new Error('INVALID_AVATAR');
      }
    }
    if (userData.fileBuffer !== undefined){
      const type = await fileTypeFromBuffer(userData.fileBuffer);
      if (type === undefined || !avatarWhiteList.includes(type.mime))
        throw new UnsupportedFileTypeError('WRONG_FILE_TYPE');
    }
    const password_hash = await bcrypt.hash(password, 12);
     const newUser = await prisma.user.create({
      data: {
        firstName: first_name,
        lastName: last_name,
        email: email,
        passwordHash: password_hash,
        birthdate: new Date(birthdate),
        pseudo: pseudo,
        profilePhotoId: avatar,
      },
    });

    if (userData.fileBuffer){
      try{
        await FileService.createFile(userData.fileBuffer, newUser.id, 'profile_photo');
      } catch (err) {
        await prisma.user.delete({
          where:{
            id: newUser.id,
          }
        })
        throw err;
      
      }
    }

    const accessToken = createToken(newUser.id);

    const { passwordHash, ...userWithoutPassword } = newUser;

    return {
      accessToken,
      userWithoutPassword,
    };
    
  }
  
}

export default new authService();

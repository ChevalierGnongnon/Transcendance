import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../common/errors.js';
import FileService from '../files/files.services.ts'

class authService {
  async login(login: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { pseudo: login }],
        isDeleted: false,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      throw new NotFoundError('Passwod not correct');
    }
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '24h',
      }
    );
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
      await FileService.createFile(userData.fileBuffer, newUser.id, 'profile_photo');
    }

    const accessToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    const { passwordHash, ...userWithoutPassword } = newUser;

    return {
      accessToken,
      userWithoutPassword,
    };
    
  }
  
}

export default new authService();

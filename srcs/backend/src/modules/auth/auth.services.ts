import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../../lib/prisma.js';
import { decode } from 'querystring';

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
      throw new Error('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      throw new Error('Invalid credentials');
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
  async prepareRegistration(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birthdate: string;
  }) {
    const { first_name, last_name, email, password, birthdate } = userData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('EMAIL_EXISTS');
    }
    const password_hash = await bcrypt.hash(password, 12);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('SERVER_MISCONFIGURED');
    }
    const token = jwt.sign({ first_name, last_name, email, password_hash, birthdate }, secret, {
      expiresIn: '24h',
    });

    return token;
  }

  async completeProfile(pseudo: string, avatar: string | null, tmpToken: string) {
    if (!tmpToken) {
      throw new Error('TOKEN_MISSING');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('SERVER_MISCONFIGURED');
    }

    let decoded: any;

    try {
      decoded = jwt.verify(tmpToken, secret);

      if (typeof decoded === 'string' || !decoded.email) {
        throw new Error('INVALID_TOKEN');
      }
    } catch (err) {
      throw new Error('INVALID_TOKEN');
    }

    const existingPseudo = await prisma.user.findUnique({ where: { pseudo } });
    if (existingPseudo) {
      throw new Error('PSEUDO_EXISTS');
    }


    const newUser = await prisma.user.create({
      data: {
        firstName: decoded.first_name,
        lastName: decoded.last_name,
        email: decoded.email,
        passwordHash: decoded.password_hash,
        birthdate: decoded.birthdate,
        pseudo: pseudo,
        profilePhotoId: avatar ?? null,
      },
    });

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

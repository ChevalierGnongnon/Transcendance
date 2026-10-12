import type { Request, Response, CookieOptions } from 'express';
import { Prisma } from '@/generated/prisma/client.js';
import authService from './auth.services.ts';
import { NotFoundError } from '../../common/errors.js';
import { UnsupportedFileTypeError } from '../../common/errors.js';

const cookieOptions : CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
};

export async function login(req: Request, res: Response) {
  try {
    const { login, password } = req.body;
    const authPayload = await authService.login(login, password);

    res.cookie('token', authPayload.token, {
      ...cookieOptions,
      maxAge:  24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }

    console.error('login error: ', error)
    return (res.status(500).json)({
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token', cookieOptions)

  return res.status(200).json({
    authenticated: false,
  });
}

export function checkAuth(_req: Request, res: Response) {
  res.status(200).json({ authenticated: true });
}

export async function register(req: Request, res: Response) {
  try {
    const { name, last_name, email, password, birthdate, pseudo, avatar } = req.body;

    const token = await authService.registration({
      first_name: name,
      last_name,
      email,
      password,
      birthdate,
      pseudo,
      avatar,
      fileBuffer: req.file?.buffer,
    });
    res.cookie('token', token.accessToken, {
      maxAge:  24 * 60 * 60 * 1000,
      ...cookieOptions,
    });

    return res.status(201).json({ success: true });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const index = (error.meta as any)?.driverAdapterError?.cause?.constraint?.index;
        if (typeof index === 'string' && index.includes('email'))
          return (res.status(409).json({ error: 'EMAIL_EXISTS' }));
        if (typeof index === 'string' && index.includes('pseudo'))
          return (res.status(409).json({ error: 'PSEUDO_EXISTS' }));
        return(res.status(409).json({
          error: 'USER_ALREADY_EXISTS'
        }));
      }
    }
    if (error.message === 'EMAIL_EXISTS') {
      return (res.status(409).json({ error: 'EMAIL_EXISTS' }));
    }
    if (error.message === 'PSEUDO_EXISTS'){
      return (res.status(409).json({ error: 'PSEUDO_EXISTS' }));
    }
    if (error.message === 'INVALID_AVATAR'){
      return (res.status(400).json({ error: 'INVALID_AVATAR'}));
    }
    if (error instanceof UnsupportedFileTypeError){
      return (res.status(415).json({ error: 'WRONG_FILE_TYPE'}));
    }
    else {
      console.error('register error: ', error)
      return (res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' }));

    }
  }
}

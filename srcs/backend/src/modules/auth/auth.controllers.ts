import type { Request, Response } from 'express';

import authService from './auth.services.ts';
import { NotFoundError } from '../../common/errors.js';

export async function login(req: Request, res: Response) {
  try {
    const { login, password } = req.body;
    const AuthPayload = await authService.login(login, password);

    res.cookie('token', AuthPayload.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: 'USER_NOT_FOUND' });
    }

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  return res.status(200).json({
    authenticated: false,
  });
}

export function checkAuth(_req: Request, res: Response) {
  res.status(200).json({ authenticated: true });
}

export async function register(req: Request, res: Response) {
  try {
    const { name, last_name, email, password, birthdate } = req.body;

    const token = await authService.prepareRegistration({
      first_name: name,
      last_name,
      email,
      password,
      birthdate,
    });

    res.cookie('tmp_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'EMAIL_EXISTS' });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}

export async function completeProfile(req: Request, res: Response) {
  try {
    const { pseudo, avatar } = req.body;
    const tmpToken = req.cookies.tmp_token;

    const AuthResult = await authService.completeProfile(pseudo, avatar, tmpToken);

    res.clearCookie('tmp_token');
    res.cookie('token', AuthResult.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.status(201).json({ success: true });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'EMAIL_EXISTS' });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}

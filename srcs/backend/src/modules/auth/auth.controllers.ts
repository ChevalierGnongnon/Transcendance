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
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.status(201).json({ success: true });
  } catch (error: any) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'EMAIL_EXISTS' });
    }
    if (error.message === 'PSEUDO_EXISTS'){
      return res.status(409).json({ error: 'PSEUDO_EXISTS' });
    }
    else {
      return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
  }
}

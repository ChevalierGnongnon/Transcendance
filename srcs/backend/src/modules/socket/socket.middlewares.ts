import type { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const requireAuth = (socket: Socket, next: (err?: Error) => void) => {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) {
    return next(new Error('Authentication required'));
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Internal server error');
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return next(new Error('Token not found'));
    }

    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'string') {
      return next(new Error('Invalid token'));
    }
    socket.userId = decoded.userId;

    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
};

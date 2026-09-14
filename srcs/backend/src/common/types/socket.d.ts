import { Socket } from 'socket.io';
import 'jsonwebtoken'

declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

declare module 'jsonwebtoken' {
  interface JwtPayload {
    userId: string;
  }

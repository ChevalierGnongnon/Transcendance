import { Server } from 'socket.io';

let io: Server;

export function initializeSocketEvents(server: Server)
{ 
	io =server;
}

export function emitAnalyticsUpdated(userId:string)
{
	io.to(`user-${userId}`).emit('analytics:updated');
}
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

export function emitAiMessageCreated(userId: string,conversationId: string) 
{
    io.to(`user-${userId}`).emit(
        'ai:message-created',
        { conversationId }
    );
}

export function emitAiRateLimit(userId: string, resetSeconds: number) {
    io.to(`user-${userId}`).emit(
        'ai:rate-limit',
        { resetSeconds }
    );
}
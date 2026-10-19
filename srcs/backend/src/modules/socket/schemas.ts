import z from 'zod';

export const messageSchema = z.object({
  id: z.uuid(),
  chatId: z.uuid(),
  recipientId: z.uuid(),
  sender: z.object({
    id: z.uuid(),
    profilePhoto: z.object({
      id: z.uuid(),
      name: z.string(),
    }),
  }),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message is too long (max 5000 characters)'),
  type: z.enum(['text', 'file', 'invitation']),
  createdAt: z.date().optional(),
});

export const lastReadSchema = z.object({
  chatId: z.uuid(),
  userId: z.uuid(),
  messageId: z.uuid(),
});

export const startNewChatSchema = z.object({
  recipientId: z.uuid(),
});

export const gameAcceptSchema = z.object({
  invitationId: z.uuid(),
  chatId: z.uuid(),
  fromUserId: z.uuid(),
  toUserId: z.uuid(),
  boardSize: z.number().int().min(10).max(20),
});

export const gameDeclineSchema = z.object({
  invitationId: z.uuid(),
  chatId: z.uuid(),
  fromUserId: z.uuid(),
  toUserId: z.uuid(),
  boardSize: z.number().int().min(10).max(20),
});

export const gameInvitationStatusSchema = z.object({
  invitationId: z.uuid(),
});

export const gamePendingInvitationSchema = z.object({
  opponentId: z.uuid(),
});

export const gameCancelInvitationSchema = z.object({
  invitationId: z.uuid(),
});

export const gameRequestRematchSchema = z.object({
  gameId: z.uuid(),
});

export const gameMoveSchema = z.object({
  gameId: z.uuid(),
  row: z.number().int().nonnegative(),
  col: z.number().int().nonnegative(),
});

export const gameStateSchema = z.object({
  gameId: z.uuid(),
});

export const gameCloseSchema = z.object({
  gameId: z.uuid(),
});

export const typingMessageSchema = z.object({
  chatId: z.uuid(),
  from: z.uuid(),
  to: z.uuid(),
});

export type newMessageInput = z.infer<typeof messageSchema>;
export type lastReadInput = z.infer<typeof lastReadSchema>;
export type startNewChat = z.infer<typeof startNewChatSchema>;
export type gameAcceptInput = z.infer<typeof gameAcceptSchema>;
export type gameDeclineInput = z.infer<typeof gameDeclineSchema>;
export type gameInvitationStatusInput = z.infer<typeof gameInvitationStatusSchema>;
export type gamePendingInvitationInput = z.infer<typeof gamePendingInvitationSchema>;
export type gameCancelInvitationInput = z.infer<typeof gameCancelInvitationSchema>;
export type gameRequestRematchInput = z.infer<typeof gameRequestRematchSchema>;
export type gameMoveInput = z.infer<typeof gameMoveSchema>;
export type gameStateInput = z.infer<typeof gameStateSchema>;
export type gameCloseInput = z.infer<typeof gameCloseSchema>;
export type typingMessage = z.infer<typeof typingMessageSchema>;

import z from 'zod';

export const messageSchema = z.object({
  id: z.uuid().optional(),
  chatId: z.uuid(),
  recipientId: z.uuid(),
  sender: z.object({
    id: z.uuid(),
    profilePhoto: z.object({
      name: z.string(),
    }),
  }),
  content: z.string(),
  type: z.enum(['text', 'image', 'file', 'audio', 'invitation']),
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

export type newMessageInput = z.infer<typeof messageSchema>;
export type lastReadInput = z.infer<typeof lastReadSchema>;
export type startNewChat = z.infer<typeof startNewChatSchema>;
export type gameAcceptInput = z.infer<typeof gameAcceptSchema>;
export type gameDeclineInput = z.infer<typeof gameDeclineSchema>;
export type gameMoveInput = z.infer<typeof gameMoveSchema>;
export type gameStateInput = z.infer<typeof gameStateSchema>;
export type gameCloseInput = z.infer<typeof gameCloseSchema>;
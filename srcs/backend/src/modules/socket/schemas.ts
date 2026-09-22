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

export type newMessageInput = z.infer<typeof messageSchema>;
export type lastReadInput = z.infer<typeof lastReadSchema>;
export type startNewChat = z.infer<typeof startNewChatSchema>;

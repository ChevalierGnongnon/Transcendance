import z from 'zod';
import { Server, Socket } from 'socket.io';

type Handler<T, R> = (socket: Socket, payload: T) => R | Promise<void>;

export function onValidated<T, R = void>(
  socket: Socket,
  event: string,
  schema: z.ZodType<T>,
  handler: Handler<T, R>
) {
  socket.on(event, async (raw: unknown, ack?: (res: unknown) => void) => {
    const result = schema.safeParse(raw);

    if (!result.success) {
      ack?.({
        ok: false,
        error: {
          event,
          issues: result.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
      });
      return;
    }
    try {
      const data = await handler(socket, result.data);
      ack?.({ ok: true, data });
    } catch (err) {
      ack?.({
        ok: false,
        error: { message: err instanceof Error ? err.message : 'Unknown error' },
      });
    }
  });
}

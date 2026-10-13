// Wie lesen wir den stream

export async function readAiResponseStream(
  response: Response,
  onChunk: (text: string) => void
) {
  if (!response.body) {
    throw new Error(
      'Streaming is not supported by this response.'
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        const remaining = decoder.decode();

        if (remaining) {
          onChunk(remaining);
        }

        break;
      }

      const chunk = decoder.decode(value, {
        stream: true,
      });

      if (chunk.includes('[AI_PROVIDER_RATE_LIMIT]')) {
        throw new Error('AI_PROVIDER_RATE_LIMIT');
      }

      if (chunk.includes('[AI_SERVICE_ERROR]')) {
        throw new Error('AI_PROVIDER_ERROR');
      }

      if (chunk) {
        onChunk(chunk);
      }
    }
  } finally {
    reader.releaseLock();
  }
}
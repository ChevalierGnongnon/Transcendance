// Wie kommunizieren wir mit dem backend 


// function to return the amoutn of request available 
function getRateLimitInfo(response: Response) {
  const header = response.headers.get('RateLimit');

  if (!header) 
    return null;

  const remainingMatch = header.match(/r=(\d+)/);
  const resetMatch = header.match(/t=(\d+)/);

  return {
    remaining: remainingMatch
      ? Number(remainingMatch[1])
      : null,

    resetSeconds: resetMatch
      ? Number(resetMatch[1])
      : null,
  };
}

// Takes which conversation and the message of the user 
export const sendAiMessage = async (
  conversationId: string,
  message: string
) => {
  // Send a request to "/api/chatbot"
  const res = await fetch('/api/chatbot', {
    method: 'POST',
    // credentailas are import fro cookies and authetication
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      message,
    }),
  });

  // console.log('AI response status:', res.status);
  // console.log('AI response headers:', [...res.headers.entries()]);

  const rateLimit = getRateLimitInfo(res);

  if (res.status === 429) {
    const retryAfter =
      res.headers.get('Retry-After');

    throw new Error(
      `AI_RATE_LIMIT:${retryAfter ?? rateLimit?.resetSeconds ?? 60}`
    );
  }

  if (!res.ok) {
    throw new Error(
      'Failed to send AI message'
    );
  }

  return {
    response: res,
    rateLimit,
  };
};


// Sends a request to create a new ai requests and returns the creates id
export const createAiConversation = async () => {
  const res = await fetch('/api/ai/conversations', {
    method: 'POST',
    credentials: 'include',
  });

  if (res.status == 401) {
    throw new Error('Unauthorized, logging out...');
  }

  if (!res.ok) {
    throw new Error('Failed to create AI conversation');
  }

  const data = await res.json();

  return data.conversationId;
};


/**
 * function to return the amount of request available 
 * @param response 
 * @returns 
 */
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

/**
 * Send a HTTP Post request to the ai chatbot wiht id and message
 * @param conversationId 
 * @param message 
 * @returns 
 */
export const sendAiMessage = async (conversationId: string,message: string) => {
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


/**
 * Sends a request to create a new ai requests and returns the created id
 * @returns conversationId
 */
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


/**
 * Request to get an existing ai message in a current session by conversationId
 * @param conversationId 
 * @returns 
 */
export const getAiMessages = async(conversationId: string | null) => {
  const res = await fetch(`/api/ai/conversations/${conversationId}/messages`, {
    credentials:'include',
    method: 'GET',});
  if (res.status === 401)
    throw new Error('Unauthorized');
  if(!res.ok)
    throw new Error('Failed to load AI messages');
  return res.json();
}
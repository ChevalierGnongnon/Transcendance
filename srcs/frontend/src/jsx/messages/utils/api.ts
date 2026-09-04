export const getChats = async () => {
  const res = await fetch(`/api/me/chats/`, {
    credentials: 'include',
  });

  if (res.status == 401) {
    throw new Error('Unauthorized, logging out...');
  }

  if (!res.ok) {
    throw new Error('Failed to fetch chats');
  }
  const chats = await res.json();
  return chats;
};

export const fetchMessages = async (chatId: string) => {
  const res = await fetch(`/api/messages/${chatId}`, {
    credentials: 'include',
  });

  if (res.status == 401) {
    throw new Error('Unauthorized, logging out...');
  }

  if (!res.ok) {
    throw new Error('Failed t ofetch messages');
  }

  const data = await res.json();
  return data;
};

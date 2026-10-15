export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  logout?: () => void
): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
  });

  if (res.status === 401) {
    logout?.();
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return res.json();
}

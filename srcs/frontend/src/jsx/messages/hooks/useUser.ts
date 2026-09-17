import { useState, useEffect } from 'react';
import type { User } from '../types';

export const useUser = () => {
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/my-profile', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setMe(data);
      })
      .catch((err) => console.error('my-profile error:', err));
  }, []);

  return me;
};

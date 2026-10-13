import { useEffect, useState } from 'react';

export function useRateLimit() {
  const [rateLimitReached, setRateLimitReached] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] =useState(0);

  // set countdown intervall every 1000 milliseconds
  useEffect(() => {
    if (!rateLimitReached || rateLimitSeconds <= 0)
      return;

    const timer = setInterval(() => {
      setRateLimitSeconds( previous => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [rateLimitReached,rateLimitSeconds,]);

  useEffect(() => {
    if (rateLimitReached && rateLimitSeconds <= 0)
      setRateLimitReached(false);

  }, [rateLimitReached,rateLimitSeconds,]);

  // function to start Timer with a given number of seconds
  function startRateLimit(seconds: number) 
  {
    setRateLimitReached(true);
    setRateLimitSeconds(seconds);
  }

  return {
    rateLimitReached,
    rateLimitSeconds,
    startRateLimit,
  };
}
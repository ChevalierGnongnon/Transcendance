
import { useEffect, useState } from 'react';
import { socket } from '../../messages/socket';

export function useRateLimit() {
  const [rateLimitReached, setRateLimitReached] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  // Countdown every second updated
  useEffect(() => {
    if (!rateLimitReached || rateLimitSeconds <= 0)
      return;

    const timer = setInterval(() => {
      setRateLimitSeconds(previous => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [rateLimitReached, rateLimitSeconds]);

  // cancel ratelimit after countdown 
  useEffect(() => {
    if (rateLimitReached && rateLimitSeconds <= 0)
      setRateLimitReached(false);
  }, [rateLimitReached, rateLimitSeconds]);

  // ratelimits from other tabs
  useEffect(() => {
    function handleAiRateLimit(data: { resetSeconds: number }) {
      startRateLimit(data.resetSeconds);
    }

    socket.on('ai:rate-limit', handleAiRateLimit);

    return () => {
      socket.off('ai:rate-limit', handleAiRateLimit);
    };
  }, []);

  // start countdown 
  function startRateLimit(seconds: number) {
    setRateLimitReached(true);
    setRateLimitSeconds(seconds);
  }

  return {
    rateLimitReached,
    rateLimitSeconds,
    startRateLimit,
  };
}

import { useEffect, useState } from 'react';
import { socket } from '../socket';

export function useSocketConnection(enabled = true) {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    if (enabled) {
      if (socket.connected) setIsConnected(true);
      else socket.connect();
    } else {
      setIsConnected(false);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      if (enabled) socket.disconnect();
    };
  }, [enabled]);

  return isConnected;
}

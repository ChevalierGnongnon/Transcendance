import { useEffect, useState } from 'react';
import { socket } from '../socket';

export function useSocketConnection(enabled = true) {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log('🔄 Attempting to connect...');
    }
    function onConnect() {
      setIsConnected(true);
      console.log('✅ Socket is connected');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('❌ Socket disconnected');
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

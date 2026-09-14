import { useEffect, useState } from 'react';
import { socket } from '../socket';

export function useSocketConnection() {
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

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  return isConnected;
}

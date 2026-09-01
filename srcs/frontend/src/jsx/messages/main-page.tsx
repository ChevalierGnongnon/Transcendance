import '../../scss/common-classes.scss';
import '../../scss/messages.scss';

import { useState, useEffect } from 'react';

import ChatRoom from './ChatRoom';
import NavBar from './navbar';
import NewChat from './new-chat';
import MoreOptions from './options';
import Block from './block';
import ChatList from './ChatList';
import { socket } from './socket.js';
import { useUser } from './hooks/useUser';

// import { io } from "socket.io-client";

function Messages() {
  const [activeView, setActiveView] = useState<
    'my messages' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation'
  >('my messages');

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const me = useUser();

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

    function onFooEvent(value: any) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  if (!me) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <>
      <NavBar activeView={activeView} setActiveView={setActiveView}></NavBar>
      <div className="socket-status justify-content-center">
        {`Status: ${isConnected ? '🟢 Connected' : '🔴 Disconnect'}`}
      </div>
      <div className={activeView !== 'my messages' ? 'd-flex' : ''}>
        <ChatList
          align={activeView === 'my messages' ? 'center' : 'left'}
          setActiveView={setActiveView}
          setActiveChatId={setActiveChatId}
        />
        {activeView === 'conversation' && activeChatId && (
          <ChatRoom me={me} chatId={activeChatId} />
        )}
        {activeView === 'new message' && <NewChat />}
        {activeView === 'block' && <Block />}
        {activeView === 'imaginaryfriend' && <MoreOptions />}
      </div>
    </>
  );
}

export default Messages;

import { useEffect, useRef } from 'react';

function Chat() {
  const [messages, setMessages] = useState(['Привет!', 'Как дела?']);
  const messagesEndRef = useRef(null); // ← создаём ссылку на элемент

  // Функция скролла вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Скроллим при каждом добавлении сообщения
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // ← срабатывает при изменении messages

  const sendMessage = () => {
    setMessages([...messages, `Сообщение ${messages.length + 1}`]);
  };

  return (
    <div>
      <div style={{ height: '200px', overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
        {/* Пустой div-якорь в самом низу */}
        <div ref={messagesEndRef} />
      </div>
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

function SmartChat() {
  const [messages, setMessages] = useState(['Привет!']);
  const containerRef = useRef(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  // Проверяем, находится ли пользователь внизу
  const checkIfAtBottom = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop <= clientHeight + 10; // +10 для погрешности
    setIsUserAtBottom(atBottom);
  };

  // Скроллим только если пользователь внизу
  useEffect(() => {
    if (isUserAtBottom && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Обработчик скролла пользователя
  const handleScroll = () => {
    checkIfAtBottom();
  };

  const sendMessage = () => {
    setMessages([...messages, `Новое сообщение ${messages.length + 1}`]);
  };

  return (
    <div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height: '200px', overflowY: 'auto' }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <button onClick={sendMessage}>Отправить</button>
      {!isUserAtBottom && (
        <button
          onClick={() => {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }}
        >
          ⬇ Новые сообщения
        </button>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

function RealtimeChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Автоскролл при новых сообщениях
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Отслеживаем скролл пользователя
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop <= clientHeight + 10;
    setIsAtBottom(atBottom);
  };

  // Отправка сообщения
  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, id: Date.now() }]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ margin: '5px 0' }}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {!isAtBottom && (
        <button
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{ margin: '10px 0' }}
        >
          ⬇ Прокрутить вниз ({messages.length})
        </button>
      )}

      <div>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Введите сообщение..."
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
}

// if (messages.length !== 0) {
//   const lastReadMessage = messages.reduce((latest, current) => {
//     const currentDate = new Date(current.createdAt || 0);
//     const latestDate = new Date(latest.createdAt || 0);
//     return currentDate > latestDate ? current : latest;
//   });
//   console.log(lastReadMessage);
// }

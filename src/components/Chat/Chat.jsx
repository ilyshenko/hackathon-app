import React, { useState, useRef, useEffect } from 'react';
import './Chat.css'; // Добавь эту строку

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesRef = useRef(null);

  // Генерация/загрузка sessionId
  const sessionId = localStorage.getItem('chatSessionId') 
    ? localStorage.getItem('chatSessionId')
    : Date.now().toString();
  localStorage.setItem('chatSessionId', sessionId);

  // URL вебхука (замените на актуальный)
  const WEBHOOK_URL = 'http://localhost:5678/webhook/chatmessege';

  // Добавление сообщения в чат
  const addMessage = (text, isUser) => {
    setMessages((prev) => [
      ...prev,
      { text, isUser, id: Date.now() + Math.random() }
    ]);
  };

  // Отправка сообщения
  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Отображаем сообщение пользователя
    addMessage(userMessage, true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: userMessage,
          timestamp: new Date().toISOString(),
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      // Читаем ответ как текст для отладки
      const responseText = await response.text();
      console.log('Сырой ответ сервера:', responseText);

      // Парсим JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Невалидный JSON:', parseError.message);
        addMessage('Ошибка: сервер вернул некорректный JSON', false);
        return;
      }

      // Извлекаем ответ бота (проверяем несколько полей)
      const botReply =
        data.answer ||
        data.output ||
        'Бот не ответил. Попробуйте ещё раз.';

      // Отображаем ответ бота
      addMessage(botReply, false);
    } catch (error) {
      console.error('Ошибка запроса:', error);
      addMessage(`Ошибка: ${error.message}`, false);
    }
  };

  // Автопрокрутка к последним сообщениям
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Обработка Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages" ref={messagesRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.isUser ? 'user-message' : 'bot-message'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите сообщение..."
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
};

export default Chat;

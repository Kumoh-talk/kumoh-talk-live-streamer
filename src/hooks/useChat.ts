import { Chat } from '@/types/chat';
import { useEffect, useState } from 'react';

const dummy: Chat[] = [
  {
    chatId: 1,
    nickname: 'Alice',
    content: 'Hello, how are you?',
    time: '2023-10-01T12:00:00Z',
  },
  {
    chatId: 2,
    nickname: 'Bob',
    content: 'I am fine, thank you! And you?',
    time: '2023-10-01T12:01:00Z',
  },
  {
    chatId: 3,
    nickname: 'Alice',
    content: 'I am doing well, thanks for asking!',
    time: '2023-10-01T12:02:00Z',
  },
  {
    chatId: 4,
    nickname: 'Charlie',
    content: 'What are you guys up to?',
    time: '2023-10-01T12:03:00Z',
  },
  {
    chatId: 5,
    nickname: 'Alice',
    content: 'Just chatting here, how about you?',
    time: '2023-10-01T12:04:00Z',
  },
  {
    chatId: 6,
    nickname: 'Bob',
    content: 'I am working on a project right now.',
    time: '2023-10-01T12:05:00Z',
  },
];

export const useChat = () => {
  const [items, setItems] = useState<Chat[]>(dummy);

  const addItem = (chat: Chat) => {
    setItems((prevChats) => [...prevChats, chat]);
  };

  useEffect(() => {
    const loop = setInterval(() => {
      const newChat: Chat = {
        chatId: items.length + 1,
        nickname: `User${items.length + 1}`,
        content: `This is a new message from User${items.length + 1}`,
        time: new Date().toISOString(),
      };
      addItem(newChat);
    }, 500);
    return () => clearInterval(loop);
  }, [items]);

  return { items };
};

// import { Chat } from '@/types/stream';
import useSocketStore from '@/utils/stores/socketStore';
// import { useEffect, useState } from 'react';


export const useChat = () => {
  const { chatMessageList: items } = useSocketStore();
  // const [items, setItems] = useState<Chat[]>(dummy);

  // const addItem = (chat: Chat) => {
  //   setItems((prevChats) => [...prevChats, chat]);
  // };

  // useEffect(() => {
  //   const loop = setInterval(() => {
  //     const newChat: Chat = {
  //       chatId: items.length + 1,
  //       nickname: `User${items.length + 1}`,
  //       content: `This is a new message from User${items.length + 1}`,
  //       time: new Date().toISOString(),
  //     };
  //     addItem(newChat);
  //   }, 500);
  //   return () => clearInterval(loop);
  // }, [items]);

  return { items };
};

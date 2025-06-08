import { Qna } from '@/types/qna';
import { useEffect, useState } from 'react';

const dummy: Qna[] = [
  {
    id: 1,
    nickname: 'User1',
    content: 'What is the meaning of life?',
    likeCount: 10,
    time: new Date().toISOString(),
    anonymous: false,
  },
  {
    id: 2,
    nickname: 'User2',
    content: 'How to learn React?',
    likeCount: 5,
    time: new Date().toISOString(),
    anonymous: false,
  },
];

export const useQna = () => {
  const [items, setItems] = useState<Qna[]>(dummy);

  const addItem = (qna: Qna) => {
    setItems((prev) => [qna, ...prev]);
  };

  useEffect(() => {
    const loop = setInterval(() => {
      const newQna: Qna = {
        id: items.length + 1,
        nickname: `User${items.length + 1}`,
        content: `This is a new question ${items.length + 1}`,
        likeCount: Math.floor(Math.random() * 20),
        time: new Date().toISOString(),
        anonymous: false,
      };
      addItem(newQna);
    }, 3000);
    return () => clearInterval(loop);
  }, [items]);

  return { items };
};

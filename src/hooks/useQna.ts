import { Qna } from '@/types/stream';
import { useEffect, useState } from 'react';

const dummy: Qna[] = [
  {
    qnaId: 1,
    nickname: 'User1',
    content: 'What is the meaning of life?',
    likes: 10,
    time: new Date().toISOString(),
    anonymous: false,
  },
  {
    qnaId: 2,
    nickname: 'User2',
    content: 'How to learn React?',
    likes: 5,
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
        qnaId: items.length + 1,
        nickname: `User${items.length + 1}`,
        content: `This is a new question ${items.length + 1}`,
        likes: Math.floor(Math.random() * 20),
        time: new Date().toISOString(),
        anonymous: false,
      };
      addItem(newQna);
    }, 3000);
    return () => clearInterval(loop);
  }, [items]);

  return { items };
};

import { useChat } from '@/hooks/useChat';
import { useCallback, useEffect, useRef, useState } from 'react';

const nameColors = [
  '#0c80d3',
  '#047143',
  '#ad19e1',
  '#6518c8',
  '#119937',
  '#c40f70',
  '#dd32e0',
  '#1915bf',
  '#0799b9',
  '#0c61e1',
  '#648e0b',
  '#e12e2e',
  '#b26c03',
  '#eb500d',
  '#c25111',
  '#0b6d82',
];

export const ChatList = () => {
  const thisRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const { items } = useChat();
  const colors = useRef<Record<string, number>>({});

  const scrollToBottom = useCallback(() => {
    if (thisRef.current) {
      thisRef.current.scrollTop = thisRef.current.scrollHeight;
    }
  }, [thisRef]);

  const onScrollHandler: React.UIEventHandler<HTMLDivElement> = (
    e: React.UIEvent<HTMLDivElement, UIEvent>
  ) => {
    const target = e.target as HTMLDivElement;

    const _touched = target.scrollTop + target.clientHeight > target.scrollHeight - 60;

    if (touched.current !== _touched) {
      touched.current = _touched;
      setAutoScroll(touched.current);
    }
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
      setTimeout(scrollToBottom, 1);
    }
  }, [autoScroll, items, scrollToBottom]);

  const getColorIndex = (nickname: string) => {
    if (!colors.current[nickname]) {
      const index = Math.floor(Math.random() * nameColors.length);
      colors.current[nickname] = index;
    }
    return colors.current[nickname];
  };

  return (
    <section
      ref={thisRef}
      onScroll={onScrollHandler}
      className="flex flex-col w-full h-0 flex-1 overflow-y-auto"
    >
      {items.map((chat) => (
        <div key={chat.chatId}>
          <span style={{ color: nameColors[getColorIndex(chat.nickname)] }}>
            {chat.nickname}: &nbsp;
          </span>
          <span>{chat.content}</span>
        </div>
      ))}
    </section>
  );
};

import { useEffect, useRef } from 'react';
import { StompSubscription } from '@stomp/stompjs';
import useSocketStore from '@/utils/stores/socketStore';
import { END_POINTS } from '@/utils/path';

export interface Props {
  chatId: string;
}

export const useChatSubscription = (props: Props) => {
  const { chatId } = props;
  const chatSubscribeRef = useRef<StompSubscription | null>(null);
  const { stompClient, addChatMessage } = useSocketStore();

  useEffect(() => {
    if (chatId && chatId !== '-1' && stompClient) {
      const newChatSubscribe = stompClient.subscribe(
        END_POINTS.SUBSCRIBE.NEW_CHAT(chatId),
        (message) => {
          const newMessage = {
            ...JSON.parse(message.body),
          };
          addChatMessage(newMessage);
        }
      );

      if (newChatSubscribe) chatSubscribeRef.current = newChatSubscribe;
    }

    return () => {
      if (chatSubscribeRef.current) {
        chatSubscribeRef.current.unsubscribe();
        chatSubscribeRef.current = null;
      }
    };
  }, [chatId, stompClient, addChatMessage]);
};

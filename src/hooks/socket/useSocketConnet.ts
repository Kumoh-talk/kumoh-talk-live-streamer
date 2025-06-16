import SockJS from 'sockjs-client/dist/sockjs';

import { Stomp } from '@stomp/stompjs';
import { useEffect } from 'react';
import useSocketStore from '@/utils/stores/socketStore';
import { WEBSOCKET_URL } from '@/utils/path';

export interface Props {
  streamId: string;
}

export const useSocketConnect = ({ streamId }: Props) => {
  const { setStompClient, setStreamId } = useSocketStore();

  const onConnect = (streamId: string) => {
    if (streamId && streamId !== '-1') {
      const client = Stomp.over(function () {
        return new SockJS(WEBSOCKET_URL);
      });

      client.connect({}, () => {
        setStompClient(client);
        setStreamId(Number(streamId));
      });
    }
  };

  useEffect(() => {
    onConnect(streamId);
  }, [streamId]);
};

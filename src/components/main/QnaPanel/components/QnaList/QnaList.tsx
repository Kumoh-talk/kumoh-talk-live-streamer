import { useStreamValue } from '@/context/context';
import { QnaItem } from './components';
import useSocketStore from '@/utils/stores/socketStore';
import { END_POINTS } from '@/utils/path';

export const QnaList = () => {
  const { socketStore, accessToken, streamId } = useStreamValue();
  const { stompClient } = useSocketStore();

  const onDelete = (qnaId: number) => {
    stompClient?.send(END_POINTS.PUBLISH.DELETE_QNA(JSON.stringify(streamId), qnaId), {
      Authorization: `Bearer ${accessToken}`,
    });
  };

  return (
    <section className="flex flex-col gap-2 w-full h-0 flex-1 overflow-y-auto overflow-x-hidden">
      {socketStore.qnaList.map((item) => (
        <QnaItem key={item.qnaId} item={item} onDelete={onDelete} />
      ))}
    </section>
  );
};

import { useStreamValue } from '@/context/context';
import { QnaItem } from './components';

export const QnaList = () => {
  const { socketStore } = useStreamValue();

  return (
    <section className="flex flex-col gap-2 w-full h-0 flex-1 overflow-y-auto overflow-x-hidden">
      {socketStore.qnaList.map((item) => (
        <QnaItem key={item.qnaId} item={item} />
      ))}
    </section>
  );
};

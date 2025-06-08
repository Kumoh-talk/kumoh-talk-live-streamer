import { QnaItem } from './components';
import { useQna } from '@/hooks/useQna';

export const QnaList = () => {
  const { items } = useQna();

  return (
    <section className="flex flex-col gap-2 w-full h-0 flex-1 overflow-y-auto overflow-x-hidden">
      {items.map((item) => (
        <QnaItem key={item.id} item={item} />
      ))}
    </section>
  );
};

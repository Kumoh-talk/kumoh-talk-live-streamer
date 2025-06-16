import { QnaList } from './components';

export const QnaPanel = () => {
  return (
    <section className="chat flex-1 flex flex-col w-full h-0 bg-white rounded-lg p-2">
      <header className="flex flex-row justify-center items-center w-full p-2">Q&A</header>
      <QnaList />
    </section>
  );
};

import { Button } from '@/components/common';
import { VoteItem, CreateVotePanel } from './components';
import { useState } from 'react';
import { useStreamValue } from '@/context/context';
import { closeVote } from '@/utils/api/vote';

export const VotePanel = () => {
  const [isOpened, setIsOpened] = useState(false);
  const { streamKey, socketStore, streamId } = useStreamValue();

  const stopVote = async () => {
    try {
      const res = await closeVote(streamId, socketStore.vote.voteId);
      console.log('투표 종료 성공:', res);
    } catch (error) {
      console.error('투표 종료 실패:', error);
    }
  };

  const notStarted = isOpened ? (
    <CreateVotePanel onClose={() => setIsOpened(false)} />
  ) : (
    streamKey?.length > 0 &&
    streamId != -1 && <Button onClick={() => setIsOpened(true)}>투표 만들기</Button>
  );

  const started = isOpened ? (
    <CreateVotePanel onClose={() => setIsOpened(false)} />
  ) : (
    <>
      {!socketStore.isVoteFinished && <Button onClick={stopVote}>투표 종료</Button>}
      <VoteItem item={socketStore.vote} result={socketStore.voteResult} />
      {socketStore.isVoteFinished && streamKey?.length > 0 && streamId != -1 && (
        <Button onClick={() => setIsOpened(true)}>새 투표 만들기</Button>
      )}
    </>
  );

  return (
    <section className="chat flex-1 flex flex-col gap-4 w-full h-0 bg-white rounded-lg p-2 overflow-y-auto">
      <header className="flex flex-row justify-center items-center w-full p-2">투표</header>

      {socketStore.isVoteShow ? started : notStarted}
    </section>
  );
};

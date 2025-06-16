import { Button } from '@/components/common';
import { VoteItem, CreateVotePanel } from './components';
import { useState } from 'react';
import { useStreamValue } from '@/context/context';
import useSocketStore from '@/utils/stores/socketStore';
import { END_POINTS } from '@/utils/path';

export const VotePanel = () => {
  const [isOpened, setIsOpened] = useState(false);
  const { socketStore, streamId, accessToken } = useStreamValue();
  const { stompClient } = useSocketStore();

  const stopVote = () => {
    stompClient?.send(
      END_POINTS.SUBSCRIBE.VOTE_CLOSE_AND_RESULT(JSON.stringify(streamId)),
      {
        Authorization: `Bearer ${accessToken}`,
      },
      JSON.stringify({
        voteId: socketStore.vote.voteId,
      })
    );
  };

  const notStarted = isOpened ? (
    <CreateVotePanel onClose={() => setIsOpened(false)} />
  ) : (
    <Button onClick={() => setIsOpened(true)}>투표 만들기</Button>
  );

  const started = (
    <>
      {!socketStore.isVoteFinished && <Button onClick={stopVote}>투표 종료</Button>}
      <VoteItem item={socketStore.vote} result={socketStore.voteResult} />
    </>
  );

  return (
    <section className="chat flex-1 flex flex-col gap-4 w-full h-0 bg-white rounded-lg p-2 overflow-y-auto">
      <header className="flex flex-row justify-center items-center w-full p-2">투표</header>

      {socketStore.isVoteShow ? started : notStarted}
    </section>
  );
};

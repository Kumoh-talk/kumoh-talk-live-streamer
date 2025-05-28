import { useStreamActions, useStreamValue } from '@/context/context';

export const StreamKeyInput = () => {
  const { streamKey } = useStreamValue();
  const { setStreamKey } = useStreamActions();

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        name="streamKey"
        placeholder="스트림키"
        value={streamKey}
        onChange={(e) => setStreamKey(e.target.value)}
      />
      <span className="break-all">메인 화면 : {streamKey}_desktop</span>
      <span className="break-all">웹캠 화면 : {streamKey}_webcam</span>
    </div>
  );
};

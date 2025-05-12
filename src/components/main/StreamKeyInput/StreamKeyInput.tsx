import { useStreamActions } from '@/context/context';
import { useEffect, useState } from 'react';

export const StreamKeyInput = () => {
  const { setStreamKey: updateStreamKey } = useStreamActions();
  const [streamKey, setStreamKey] = useState<string>('rtmp://localhost:1935');

  useEffect(() => {
    updateStreamKey(streamKey);
  }, [streamKey]);

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

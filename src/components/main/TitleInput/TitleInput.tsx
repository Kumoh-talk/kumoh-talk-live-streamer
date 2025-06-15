import { Button } from '@/components/common';
import { useStreamActions, useStreamValue } from '@/context/context';
import { useState } from 'react';

export const TitleInput = () => {
  const { title } = useStreamValue();
  const { setTitle } = useStreamActions();

  const [_title, _setTitle] = useState(title);

  return (
    <div className="flex flex-row items-center">
      <span className="w-32 px-2">방송제목</span>
      <div className="flex flex-row items-center gap-2 flex-1">
        <input
          type="text"
          className="w-0 flex-1"
          placeholder="방송 제목을 입력하세요."
          value={_title}
          onChange={(e) => _setTitle(e.target.value)}
        />
        <Button onClick={() => setTitle(_title)}>저장</Button>
      </div>
    </div>
  );
};

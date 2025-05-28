import { InputForm } from '@/components/common';
import { StreamKeyInput } from '@/components/main';

export const ConnectionTab = () => {
  return (
    <>
      <InputForm label="스트림 키">
        <StreamKeyInput />
      </InputForm>
    </>
  );
};

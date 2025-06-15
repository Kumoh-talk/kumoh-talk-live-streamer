import { InputForm } from '@/components/common';
import { StreamKeyInput } from '@/components/main';
import { LoginArea } from './components';

export const ConnectionTab = () => {
  return (
    <>
      <LoginArea />
      <InputForm label="스트림 키">
        <StreamKeyInput />
      </InputForm>
    </>
  );
};

import { InputForm } from '@/components/common';
import { StreamKeyInput } from '@/components/main';
import GithubSvg from '@/assets/social/GithubSvg';
import KakaoSvg from '@/assets/social/KakaoSvg';
import NaverSvg from '@/assets/social/NaverSvg';

const logins = [
  {
    provider: 'github',
    svg: GithubSvg,
  },
  {
    provider: 'kakao',
    svg: KakaoSvg,
  },
  {
    provider: 'naver',
    svg: NaverSvg,
  },
];

export const ConnectionTab = () => {
  const onLogin = async (provider: string) => {
    try {
      const result = await window.options.openLoginPopup(provider);
      console.log('Login successful:', result);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const loginButtons = logins.map((login) => (
    <button
      key={login.provider}
      className="flex size-11 cursor-pointer"
      onClick={() => onLogin(login.provider)}
    >
      <login.svg />
    </button>
  ));

  return (
    <>
      <InputForm label="로그인">{loginButtons}</InputForm>
      <InputForm label="스트림 키">
        <StreamKeyInput />
      </InputForm>
    </>
  );
};

import { useStreamActions, useStreamValue } from '@/context/context';
import { Button, InputForm } from '@/components/common';
import GithubSvg from '@/assets/social/GithubSvg';
import KakaoSvg from '@/assets/social/KakaoSvg';
import NaverSvg from '@/assets/social/NaverSvg';
import { AccessToken } from '@/types/api';
import { jwtDecode } from 'jwt-decode';

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

export const LoginArea = () => {
  const { accessToken, streamKey } = useStreamValue();
  const { handleLogin, logout } = useStreamActions();

  const onLogin = (result: { accessToken: string; refreshToken: string }) => {
    handleLogin(result.accessToken, result.refreshToken);
  };

  return (
    <InputForm label="계정">
      {accessToken ? (
        <Logined accessToken={accessToken} streamKey={streamKey} onLogout={logout} />
      ) : (
        <Logouted onLogin={onLogin} />
      )}
    </InputForm>
  );
};

interface LoginedProps {
  accessToken: string;
  streamKey: string;
  onLogout: () => void;
}
const Logined = (props: LoginedProps) => {
  const decoded = jwtDecode(props.accessToken) as AccessToken | null;
  if (!decoded) {
    console.error('Invalid token');
    return (
      <div className="flex flex-col py-1.5">
        <span>로그인을 실패했습니다.</span>
        <Button onClick={props.onLogout}>다시 시도하기</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1 py-1.5">
      <span>닉네임: {decoded.USER_NICKNAME}</span>
      <span>스트림키: {props.streamKey}</span>
      <Button onClick={props.onLogout}>로그아웃</Button>
    </div>
  );
};

interface LogoutedProps {
  onLogin: (token: { accessToken: string; refreshToken: string }) => void;
}
const Logouted = (props: LogoutedProps) => {
  const onLogin = async (provider: string) => {
    try {
      const result = await window.options.openLoginPopup(provider);
      if (result) {
        props.onLogin(result);
      }
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
  return loginButtons;
};

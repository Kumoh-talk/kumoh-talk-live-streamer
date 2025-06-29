import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | undefined>(undefined);

  const handleLogin = useCallback(
    (accessToken: string, refreshToken: string) => {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      toast.info('로그인에 성공했습니다.');
    },
    [setAccessToken, setRefreshToken]
  );

  const logout = useCallback(() => {
    setAccessToken(undefined);
    setRefreshToken(undefined);
    toast.info('로그아웃되었습니다.');
  }, [setAccessToken, setRefreshToken]);

  useEffect(() => {
    window.electronCookie.set({
      name: 'accessToken',
      value: accessToken || undefined,
      url: 'http://localhost',
    });
    window.electronCookie.set({
      name: 'refreshToken',
      value: refreshToken || undefined,
      url: 'http://localhost',
    });
  }, [accessToken, refreshToken]);

  return {
    accessToken,
    refreshToken,
    handleLogin,
    logout,
  };
};

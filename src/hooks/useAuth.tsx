import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

export const useAuth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const handleLogin = useCallback(
    (accessToken: string, refreshToken: string) => {
      setCookie('accessToken', accessToken, { path: '/' });
      setCookie('refreshToken', refreshToken, { path: '/' });
    },
    [setCookie]
  );

  const logout = useCallback(() => {
    removeCookie('accessToken', { path: '/' });
    removeCookie('refreshToken', { path: '/' });
  }, [removeCookie]);

  return {
    accessToken: cookies.accessToken,
    refreshToken: cookies.refreshToken,
    handleLogin,
    logout,
  };
};

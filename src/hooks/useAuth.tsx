import { useCallback, useEffect, useState } from 'react';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | undefined>(undefined);

  const handleLogin = useCallback(
    (accessToken: string, refreshToken: string) => {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    },
    [setAccessToken, setRefreshToken]
  );

  const logout = useCallback(() => {
    setAccessToken(undefined);
    setRefreshToken(undefined);
  }, [setAccessToken, setRefreshToken]);

  useEffect(() => {
    window.electronCookie.set({ name: 'accessToken', value: accessToken || undefined, url: 'http://localhost' });
    window.electronCookie.set({ name: 'refreshToken', value: refreshToken || undefined, url: 'http://localhost' });
  }, [accessToken, refreshToken]);

  return {
    accessToken,
    refreshToken,
    handleLogin,
    logout,
  };
};

import { ApiError, ApiResponse } from '@/types/api';
import Cookies from 'js-cookie';

export const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Cookies.get('accessToken') || ''}`,
  };
  return headers;
};

export const api = async <T>(
  path: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
): Promise<ApiResponse<T> | ApiError> => {
  try {
    const res = (await window.api.fetch(`${import.meta.env.VITE_API_BASE_URI}${path}`, {
      method,
      headers: getHeaders(),
      ...(body ? { body: JSON.stringify(body) } : {}),
    })) as ApiResponse<T> | ApiError;
    console.log('API Response:', res);
    return res;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
    return {
      success: false,
      statusCode: 404,
      path: path,
      errMsg: '네트워크 오류',
    } as ApiError;
  }
};

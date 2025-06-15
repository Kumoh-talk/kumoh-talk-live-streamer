import { Streaming } from '@/types/stream';
import { api } from './common';
import { CreateStreamKeyResponse } from '@/types/api/stream';

export const getStreams = async () => {
  const url = `/stream/list`;
  const res = await api<{ streamingList: Streaming[] }>(url, 'GET');
  if ('success' in res && res.success) {
    return res.data;
  }
  throw new Error('방송 목록 조회 실패');
};

export const startStream = async () => {
  const url = `/stream/start`;
  const res = await api(url, 'POST');
  if ('success' in res && res.success) {
    return res.data;
  }
  throw new Error('방송 시작 실패');
};

export const stopStream = async () => {
  const url = `/stream/stop`;
  const res = await api(url, 'POST');
  if ('success' in res && res.success) {
    return res.data;
  }
  throw new Error('방송 종료 실패');
};

export const getStreamKey = async () => {
  const url = `/stream/streamKey`;
  const res = await api<{ streamKey: string }>(url, 'GET');
  if ('success' in res && res.success) {
    return res.data.streamKey;
  }
  throw new Error('스트림 키 조회 실패');
};

export const createStreamKey = async () => {
  const url = `/stream/streamKey`;
  const res = await api<CreateStreamKeyResponse>(url, 'POST');
  console.log(res);
  if ('success' in res && res.success) {
    return res.data.streamKey;
  }
  throw new Error('스트림 키 생성 실패');
};

export const changeStreamingTitle = async (streamKey: string, title: string) => {
  const url = `/stream/title`;
  const res = await api<{ streamId: number }>(url, 'PATCH', { streamKey, title });
  if ('success' in res && res.success) {
    return res.data.streamId;
  }
  throw new Error('방송 제목 변경 실패');
};

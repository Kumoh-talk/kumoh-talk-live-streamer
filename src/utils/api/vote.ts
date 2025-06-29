import { CloseVoteResponse, CreateVoteRequest } from '@/types/api/vote';
import { api } from './common';

export const createVote = async (streamId: number, dto: CreateVoteRequest) => {
  const url = `/vote/${streamId}`;
  const res = await api<CreateVoteRequest>(url, 'POST', dto);
  if ('success' in res && res.success) {
    return res.data;
  }
  throw new Error('투표 시작 실패');
};

export const closeVote = async (streamId: number, voteId: number) => {
  const url = `/vote/${streamId}/${voteId}`;
  const res = await api<CloseVoteResponse>(url, 'DELETE');
  if ('success' in res && res.success) {
    return res.data;
  }
  throw new Error('투표 종료 실패');
};

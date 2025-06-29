import { VoteResult } from '../stream';

export type CreateVoteRequest = {
  title: string;
  selects: string[];
  multiple: boolean;
};

export type CloseVoteResponse = VoteResult;

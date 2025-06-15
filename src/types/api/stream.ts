export type CreateStreamKeyResponse = {
  streamKey: string;
  expireAt: string;
};

export type StreamKeyListResponse = {
  streamKeyList: string[];
};

export type StreamIdResponse = {
  streamId: number;
};

export type ChangeStreamingTitleRequest = {
  streamKey: string;
  title: string;
};

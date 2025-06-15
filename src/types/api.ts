export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  statusCode: number;
  path: string;
  errMsg: string;
};

export interface AccessToken {
  USER_ID: number;
  USER_NICKNAME: string;
  USER_ROLE: Role;
  iat: number;
  exp: number;
}

export type Role =
  | 'ROLE_GUEST'
  | 'ROLE_USER'
  | 'ROLE_ACTIVE_USER'
  | 'ROLE_SEMINAR_WRITER'
  | 'ROLE_ADMIN';

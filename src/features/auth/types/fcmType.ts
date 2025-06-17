export interface FcmTokenUpdateInput {
  memberId: number;
  token: string;
}

export interface FcmTokenRemoveInput {
  memberId: number;
}

export interface FcmTokenResponse {
  status: number;
  data: any;
}
import api from "@/@shared/api/api"

import { FcmTokenUpdateInput, FcmTokenRemoveInput, FcmTokenResponse } from "../types/fcmType";

export const fetchFcmtokenRemove = async ({memberId}: FcmTokenRemoveInput): Promise<FcmTokenResponse> => {
    const response = await api.patch(
        `/api/notifications/fcm-token/remove?memberId=${memberId}`);
    return { status: response.status, data: response.data };
};

export const fetchFcmtokenUpdate = async ({ memberId, token }: FcmTokenUpdateInput): Promise<FcmTokenResponse> => {
    if (!token) {
    throw new Error('Token is required');
  }
    const response = await api.patch(`/api/notifications/fcm-token?memberId=${memberId}`, { memberId, token });
    return { status: response.status, data: response.data };

}
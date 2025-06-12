import api from "@/@shared/api/api"

export const fetchFcmtokenRemove = async (memberId: number) => {
    const response = await api.patch(
        `/api/notifications/fcm-token/remove?memberId=${memberId}`);
    return { status: response.status, data: response.data };
};
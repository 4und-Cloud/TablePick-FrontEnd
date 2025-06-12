import api from "@/@shared/api/api";

export const fetchMemberNotification = async (memberId: number, status?: string) => {
     const url = status 
      ? `/api/notifications/member/${memberId}?status=${status}`
      : `/api/notifications/member/${memberId}`;
    
    const response = await api.get(url);
    return { status: response.status, data: response.data };
}
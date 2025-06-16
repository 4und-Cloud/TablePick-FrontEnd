import api from "@/@shared/api/api";
import { NotificationTypes } from "@/features/notification/types/notification";

export const fetchSendNotification = async (
    id: number,
    name: string,
    type: NotificationTypes = 'REGISTER_COMPLETED') => {
    const payload = {
        NotificationTypes: type,
        title: '식당 예약 완료',
        message: `${name} 예약이 성공적으로 완료되었습니다.`,
        restaurantId: id
    };
        const response = await api.post('/api/notifications/test', payload);
        return response.data;
}

export const fetchMemberNotification = async (memberId: number, status?: string) => {
     const url = status 
      ? `/api/notifications/member/${memberId}?status=${status}`
      : `/api/notifications/member/${memberId}`;
    
    const response = await api.get(url);
    return { status: response.status, data: response.data };
}

export const fetchNotificationScheduleReservation = async (reservationId: number) => {
    await api.post(`/api/notifications/schedule/reservation/${reservationId}`);
};

export const fetchNotificationTypes = async () => {
    const response = await api.get('/api/notifications/notification-types');
    return { status: response.status, data: response.data };
};
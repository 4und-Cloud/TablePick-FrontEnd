import api from "@/@shared/api/api";

export const fetchNotificationTypes = async () => {
    const response = await api.get('/api/notifications/notification-types');
    return { status: response.status, data: response.data };
};
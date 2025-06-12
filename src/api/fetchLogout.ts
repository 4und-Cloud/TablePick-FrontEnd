import api from "@/@shared/api/api";

export const fetchLogout = async () => {
    await api.post('/api/members/logout');
}
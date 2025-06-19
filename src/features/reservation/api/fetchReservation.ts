import api from "@/@shared/api/api";
import { ReservationRequest, ReservationResponse, ReservationData } from "../types/reservationType";

export const fetchMemberReservation = async (): Promise<ReservationData[]> => {
    const response = await api.get('/api/members/reservations');
    return response.data
}

export const fetchReservation = async (reservatiaonData: ReservationRequest): Promise<ReservationResponse> => {
    const response = await api.post(`/api/reservations`, reservatiaonData);
    const data = response.data;

    const reservationId = data.reservationId || data.id;
    if (!reservationId) {
        throw new Error('예약 아이디가 없음');
    };

    return { reservationId, ...data };
};

export const fetchReservationDelete = async (reservationId: number) => {
    await api.delete(`/api/reservations/${reservationId}`);
}

export const fetchAvailableReservationTimes = async (
  date: Date,
  restaurantId: number
): Promise<string[]> => {
  if (!date || !restaurantId) return [];

  const formattedDate = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' }).replace(/\//g, '-');
  const url = `/api/reservations/available-times?restaurantId=${restaurantId}&date=${formattedDate}`;

  const res = await api.get(url);

  const times = Array.isArray(res.data)
    ? res.data
    : res.data.availableTimes || [];

  // 'HH:mm:ss' → 'HH:mm' 변환
  return times.map((time: string) => time.substring(0, 5));
};
export interface ReservationRequest {
  restaurantId: number;
  reservationDate: string; // 'YYYY-MM-DD'
  reservationTime: string; // 'HH:mm'
  partySize: number;
};

export interface ReservationResponse {
    reservationId: number;
};

export interface ReservationData {
  id: number;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  reservationStatus: string;
  restaurantId: number;
  restaurantName: string;
  restaurantAddress: string;
  restaurantImage: string;
};
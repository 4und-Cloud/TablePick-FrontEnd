import { useEffect, useState } from "react";
import { CardItemProps } from "../components/CardItem";
import place from '@/assets/images/place.png';
import List from "../components/List";
import RoundedBtn from "../components/Button/RoundedBtn";
import { PostWriteModal } from "../components/Modal/PostWriteModal";

interface ReservationData {
  id: number;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  reservationStatus: string;
  restaurantId: number;
  restaurantName: string;
  restaurantAddress: string;
  restaurantImage: string;
}

export default function ReservationCheck() {
  const [reservations, setReservations] = useState<CardItemProps[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [selectedReservationData, setSelectedReservationData] = useState<ReservationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReservationCheck();
  }, []);

  useEffect(() => {
    if (selectedReservationData !== null && selectedReservationId !== null) {
      setIsModalOpen(true);
    }
  }, [selectedReservationData, selectedReservationId]);

  const fetchReservationCheck = async () => {
    try {
      const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL;
      const res = await fetch(`${apiUrl}/api/members/reservations`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('응답 실패 :', errorText);
        throw new Error('예약 정보 불러오기 실패');
      }

      const data: ReservationData[] = await res.json();

      const formattedReservations: CardItemProps[] = data.map(reservation => ({
        id: reservation.id,
        image: reservation.restaurantImage,
        restaurantName: reservation.restaurantName,
        description: reservation.restaurantAddress,
        reservationInfo: `${reservation.reservationDate} (${new Date(reservation.reservationDate).toLocaleDateString('ko-KR', { weekday: 'short' })}) ${reservation.partySize}명 ${reservation.reservationTime}`,
        button: (
          <div className="flex flex-row gap-2 w-full justify-between"> 
            <RoundedBtn
              text='게시글 작성하러 가기'
              width="w-[170px]"
              bgColor="bg-main"
              height="h-[30px]"
              textColor="text-white"
              hoverBorderColor="hover:border-accent"
              hoverColor="hover:bg-white"
              hoverTextColor="hover:text-main"
              onClick={() => {
                setSelectedReservationId(reservation.id);
                setSelectedReservationData(reservation);
              }}
            />

            <RoundedBtn
              text='예약 취소'
              width="w-[170px]" 
              bgColor="bg-red-500"
              height="h-[30px]"
              textColor="text-white"
              hoverBorderColor="hover:border-red-700"
              hoverColor="hover:bg-white"
              hoverTextColor="hover:text-red-500"
              onClick={() => handleCancelReservation(reservation.id)}
            />
          </div>
        ),
        buttonPosition: 'bottom'
      }));

      setReservations(formattedReservations);

    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservationId(null);
    setSelectedReservationData(null);
    fetchReservationCheck();
  };

  const handleCancelReservation = async (reservationId: number) => {
    const isConfirmed = window.confirm('정말로 이 예약을 취소하시겠습니까?');
    if (!isConfirmed) {
      return; // "취소"를 누르면 함수 종료, 알림 없음
    }

    try {
      const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL;
      const res = await fetch(`${apiUrl}/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('예약 취소 실패 응답:', errorText);
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.message) {
                alert(`예약 취소 실패: ${errorJson.message}`);
            } else {
                alert(`예약 취소 실패: ${res.statusText}`);
            }
        } catch (e) {
            alert(`예약 취소 실패: ${res.statusText}`);
        }
        throw new Error(`예약 취소 실패: ${res.status} ${res.statusText}`);
      }

      alert('예약이 성공적으로 취소되었습니다.');
      fetchReservationCheck();
    } catch (error) {
      console.error('예약 취소 중 오류 발생:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="m-4">
      <div>
        {reservations.length > 0 ? (
          <List items={reservations} />
        ) : (
          <p className="text-center text-gray-500 mt-10">예약 내역이 없습니다.</p>
        )}

        <div>
        </div>
      </div>
      {isModalOpen && selectedReservationData && (
        <PostWriteModal
          closeModal={handleCloseModal}
          reservationId={selectedReservationId}
          initialData={{
            restaurant: selectedReservationData.restaurantName,
            content: "",
            selectedTagIds: []
          }}
        />
      )}
    </div>
  );
}
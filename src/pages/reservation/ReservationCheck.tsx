import { useEffect, useState } from "react";
import { CardItemProps } from "@/@shared/types/cardItemsType";
import logo from '@/@shared/images/logo.png';
import List from "@/@shared/components/List";
import RoundedBtn from "@/@shared/components/Button/RoundedBtn";
import { PostWriteModal } from "@/pages/reservation/components/PostWriteModal";
import { fetchMemberReservation, fetchReservationDelete } from '@/features/reservation/api/fetchReservation';
import { ReservationData } from "@/features/reservation/types/reservationType";
import useAuth from "@/features/auth/hook/useAuth";

export default function ReservationCheck() {
  const [reservations, setReservations] = useState<CardItemProps[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [selectedReservationData, setSelectedReservationData] = useState<ReservationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      console.log(`현재 로그인 아이디 :${user.id}`);
      fetchReservationCheck();
    } else {
      console.log('로그아웃 상태');
      setReservations([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedReservationData !== null && selectedReservationId !== null) {
      setIsModalOpen(true);
    }
  }, [selectedReservationData, selectedReservationId]);

  const fetchReservationCheck = async () => {
    try {
      const response = await fetchMemberReservation();

      const formattedReservations: CardItemProps[] = response.map(reservation => {
        const item: CardItemProps = {
          id: reservation.id,
          image: reservation.restaurantImage || logo, // 기본 이미지
          restaurantName: reservation.restaurantName,
          description: reservation.restaurantAddress,
          reservationInfo: `${reservation.reservationDate} (${new Date(reservation.reservationDate).toLocaleDateString('ko-KR', { weekday: 'short' })}) ${reservation.partySize}명 ${reservation.reservationTime}`,
          linkTo: `/restaurants/${reservation.restaurantId}`,
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
          buttonPosition: 'bottom' as const, // 리터럴 타입 명시
        };
        return item;
      });

      setReservations(formattedReservations);

    } catch (error :any) {
      console.error('데이터 불러오기 실패:', error);
      if (error.response?.status !== 401) {
        const message = error.response?.data?.message || '예약 정보를 불러오지 못했습니다.';
        alert(message);
      }
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
      fetchReservationDelete(reservationId);
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
          <List items={reservations}/>
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
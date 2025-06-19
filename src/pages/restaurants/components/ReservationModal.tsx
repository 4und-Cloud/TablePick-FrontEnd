import Modal from "../../../@shared/components/Modal/Modal";
import RoundedBtn from "../../../@shared/components/Button/RoundedBtn";
import Calendar, { type CalendarProps } from "react-calendar";
import { useEffect, useState } from "react";
import useAuth from '@/features/auth/hook/useAuth';
import { fetchReservation, fetchAvailableReservationTimes } from '@/features/reservation/api/fetchReservation';
import { fetchNotificationScheduleReservation } from '@/features/notification/api/fetchNotification';
import { useNotification } from '@/features/notification/hook/useNotification'
import 'react-calendar/dist/Calendar.css';

interface ReservationModalProps {
  closeModal: () => void;
  onSuccess?: () => void;
  restaurantId: number;
}

type SelectDate = Date;

export default function ReservationModal({ closeModal, onSuccess, restaurantId }: ReservationModalProps) {
  const { isAuthenticated } = useAuth();
  const { fcmInitialized, notificationInitialized, error: notificationError } = useNotification();
  const [selectedPeople, setSelectedPeople] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<SelectDate>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState<boolean>(false);

  const handlePeopleSelect = (people: number) => {
    setSelectedPeople(people);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    const newDate = value as Date;
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const loadAvailableTimes = async (date: Date | null, restaurantId: number) => {
    if (!date || !restaurantId) {
      setAvailableTimes([]);
      setSelectedTime('');
      return;
    }
    setIsLoadingTimes(true);
    try {
      const times = await fetchAvailableReservationTimes(date, restaurantId);
      setAvailableTimes(times);
      setSelectedTime(times.length > 0 ? times[0] : '');
    } catch (error) {
      console.error('예약 가능 시간 로드 오류:', error);
      setAvailableTimes([]);
      setSelectedTime('');
      alert(`예약 가능 시간 불러오기 실패: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoadingTimes(false);
    }
  };

  useEffect(() => {
    setAvailableTimes([]);
    setSelectedTime('');
    if (selectedDate && restaurantId) {
      loadAvailableTimes(selectedDate, restaurantId);
    }
  }, [selectedDate, restaurantId]);

  const handleReservation = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      closeModal();
      return;
    }

    if (!selectedDate) {
      alert('날짜를 선택해 주세요!');
      return;
    }

    if (!selectedTime) {
      alert('시간을 선택해 주세요!');
      return;
    }

    if (!fcmInitialized || !notificationInitialized) {
      alert(notificationError || '알림 시스템 초기화 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const reservationData = {
        restaurantId,
        reservationDate: formatDate(selectedDate),
        reservationTime: selectedTime,
        partySize: selectedPeople,
      };

      // 예약 API 호출
      const result = await fetchReservation(reservationData);
      const reservationId = result.reservationId || result.reservationId;

      if (!reservationId) {
        throw new Error('Reservation ID is missing in response');
      }

      // 알림 스케줄링 API 호출
      await fetchNotificationScheduleReservation(reservationId);

      alert(
        `✅ 예약 완료:\n\n📅 날짜: ${selectedDate.toLocaleDateString()}\n⏰ 시간: ${selectedTime}\n👤 인원: ${selectedPeople}명`
      );

      if (onSuccess) {
        onSuccess();
      }
      closeModal();
    } catch (error: any) {
      console.error('예약 처리 중 오류:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        response: error.response?.data,
      });
      alert(
        `예약 처리 중 오류: ${
          error.response?.data?.message || error.message || '알 수 없는 오류'
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      width="400px"
      height="630px"
      close={
        <button onClick={closeModal} className="text-main font-bold text-xl inset-0 z-50">
          X
        </button>
      }
      footer={
        <RoundedBtn
          text={isSubmitting ? "예약 처리 중..." : "예약하기"}
          onClick={handleReservation}
          bgColor="bg-main"
          textColor="text-white"
          borderColor="border-main"
          hoverColor="hover:bg-white"
          hoverTextColor="hover:text-main"
          hoverBorderColor="hover:border-main"
          width="w-full"
          //disabled={isSubmitting || availableTimes.length === 0 || !selectedTime}
        />
      }
    >
      <div className="mt-8 flex items-center justify-center">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          view='month'
          selectRange={false}
          minDate={new Date()}
          maxDate={new Date(new Date().setDate(new Date().getDate() + 6))}
          prev2Label={null}
          next2Label={null}
          showNeighboringMonth={false}
        />
      </div>

      <div className="mt-4">
        <p className="ml-2 font-semibold">인원수</p>
        <div className="flex justify-start space-x-4 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
          {[1, 2, 3, 4, 5, 6].map((people) => (
            <button
              key={people}
              onClick={() => handlePeopleSelect(people)}
              className={`px-4 py-2 rounded-full border-2 transition-all ${
                selectedPeople === people ? "bg-main text-white border-main" : "text-main border-main"
              }`}
            >
              {people}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="ml-2 font-semibold">시간</p>
        <div className="flex justify-start space-x-4 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
          {isLoadingTimes ? (
            <p className="ml-2 text-gray-500">예약 가능 시간 불러오는 중...</p>
          ) : availableTimes.length > 0 ? (
            availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  selectedTime === time ? "bg-main text-white border-main" : "text-main border-main"
                }`}
              >
                {time}
              </button>
            ))
          ) : (
            <p className="ml-2 text-gray-500">선택된 날짜에 예약 가능 시간이 없습니다.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
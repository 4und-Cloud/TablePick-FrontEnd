import Modal from "../../../@shared/components/Modal/Modal"
import RoundedBtn from "../../../@shared/components/Button/RoundedBtn"
import Calendar, {type CalendarProps} from "react-calendar"
import {useEffect, useState} from "react"
import useAuth from '@/features/auth/hook/useAuth'
import { fetchReservation, fetchAvailableReservationTimes } from '@/features/reservation/api/fetchReservation';
import { fetchNotificationScheduleReservation } from '@/features/notification/api/fetchNotification';

interface ReservationModalProps {
  closeModal: () => void;
  onSuccess?: () => void;
  restaurantId: number;
}

export default function ReservationModal({closeModal, onSuccess, restaurantId}: ReservationModalProps) {
  const { isAuthenticated } = useAuth();
  const [selectedPeople, setSelectedPeople] = useState<number>(1);
  // 시간의 초기값을 빈 문자열로 지정
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 이용 가능한 시간에 대한 상태 관리
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  // 로딩 상태 추가
  const [isLoadingTimes, setIsLoadingTimes] = useState<boolean>(false);

  const handlePeopleSelect = (people: number) => {
    setSelectedPeople(people);
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value)
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0])
    }
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const loadAvailableTimes = async (date: Date | null, restaurantId: number) => {
    // 날짜 | 식당 id 없으면 api 호출 X
    if (!date || !restaurantId) {
      setAvailableTimes([]); // 시간 목록 초기화
      setSelectedTime(''); // 선택된 시간 초기화
      return;
    }
    setIsLoadingTimes(true);
    try {
      const times = await fetchAvailableReservationTimes(date, restaurantId);

      setAvailableTimes(times);
      setSelectedTime(times.length > 0 ? times[0] : '');
    } catch (error) {
      console.error('예약 가능 시간 로드 오류 :', error);
      setAvailableTimes([]);
      setSelectedTime('');
      alert(`예약 가능 시간 불러오기 실패 : ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoadingTimes(false);
    }
  }

  useEffect(() => {
    if (selectedDate && restaurantId) {
      loadAvailableTimes(selectedDate, restaurantId);
    }
  }, [selectedDate, restaurantId]);

  const handleReservation = async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.")
      closeModal()
      return
    }

    if (!selectedDate) {
      alert("날짜를 선택해 주세요!")
      return
    }

    if (!selectedTime) {
      alert("시간을 선택해 주세요!")
      return
    }

    try {
      setIsSubmitting(true)

      // 예약 정보 생성
      const reservationData = {
        restaurantId,
        reservationDate: formatDate(selectedDate),
        reservationTime: selectedTime,
        partySize: selectedPeople,
      };

      // 예약 API 호출
      const result = await fetchReservation(reservationData);

      // 예약 성공 후 알림 스케줄링 API 호출
      await fetchNotificationScheduleReservation(result.reservationId);

      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess();
      } else {
        alert(
          `✅ 예약 완료:\n\n📅 날짜: ${selectedDate.toLocaleDateString()}\n⏰ 시간: ${selectedTime}\n👤 인원: ${selectedPeople}명`,
        );
        closeModal();
      }
    } catch (error: any) {
    console.error('예약 처리 중 오류:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      response: error.response?.data, // 서버 응답 데이터
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
          //disabled = {isSubmitting || availableTimes.length === 0 || !selectedTime}
        />
      }
    >
      <div className="mt-8 flex items-center justify-center">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          selectRange={false}
          minDate={new Date()} // 오늘 이후 날짜만 선택 가능
          maxDate={new Date(new Date().setDate(new Date().getDate() + 6))}
          // tileDisabled={({ date, view }) =>
          //   view === 'month' && (date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 6)))
          // }
        />
      </div>

      {/* 인원수 선택 */}
      <div className="mt-4">
        <p className="ml-2 font-semibold">인원수</p>
        <div
          className="flex justify-start space-x-4 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
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

      {/* 시간 선택 */}
      <div className="mt-6">
        <p className="ml-2 font-semibold">시간</p>
        <div
          className="flex justify-start space-x-4 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
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
              ))) : (<p className="ml-2 text-gray-500">선택된 날짜에 예약 가능 시간이 없습니다.</p>)
        }
        </div>
      </div>
    </Modal>
  )
}

import Modal from "./Modal"
import RoundedBtn from "../Button/RoundedBtn"
import Calendar, {type CalendarProps} from "react-calendar"
import {useEffect, useState} from "react"
import useAuth from "../../hooks/useAuth"
import api from "../../lib/api"

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
      console.log('선택 날짜 확인 :', setSelectedDate(value));
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

  const fetchAvailableTimes = async (date: Date | null, restaurantId: number) => {
    // 날짜 | 식당 id 없으면 api 호출 X
    if (!date || !restaurantId) {
      setAvailableTimes([]); // 시간 목록 초기화
      setSelectedTime(''); // 선택된 시간 초기화
      return;
    }
    setIsLoadingTimes(true);
    try {
      const formatedDate = date.toISOString().split('T')[0];

      const res = await api.get(`/api/reservations/available-times?restaurantId=${restaurantId}&date=${formatedDate}`);

      const times = Array.isArray(res.data) ? res.data : (res.data.availableTimes || []);

      setAvailableTimes(times
        .map((time : string) => time.substring(0, 5)));

      setSelectedTime(times.length > 0 && typeof times[0] === 'string' && times[0] !== null ? (times[0] as string).substring(0, 5) : '');
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
      fetchAvailableTimes(selectedDate, restaurantId);
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
        restaurantId: restaurantId,
        reservationDate: formatDate(selectedDate),
        reservationTime: selectedTime,
        partySize: selectedPeople,
      };

      console.log('Sending reservation data:', reservationData);

      // 예약 API 호출
      // const response = await fetch("http://localhost:8080/api/reservations", {
      const response = await api.post(`/api/reservations`, reservationData);
      const result = response.data;

      const reservationId = result.reservationId || result.id;
    if (!reservationId) {
      throw new Error('Reservation ID is missing in response');
    }

      console.log('Reservation response:', result);

      // 예약 성공 후 알림 스케줄링 API 호출
      // await fetch(`http://localhost:8080/api/notifications/schedule/reservation/${result.id}`, {
      await api.post(`/api/notifications/schedule/reservation/${reservationId}`);

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

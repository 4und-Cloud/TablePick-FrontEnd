import Modal from "./Modal";
import RoundedBtn from "./Button/RoundedBtn";
import Calendar, { CalendarProps } from "react-calendar";
import { useState } from "react";

interface ReservationModalProps {
  closeModal: () => void;
}

export default function ReservationModal({ closeModal }: ReservationModalProps) {
  const [selectedPeople, setSelectedPeople] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string>("11:00");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handlePeopleSelect = (people: number) => {
    setSelectedPeople(people);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0]);
    }
  };

  const handleReservation = () => {
    if (!selectedDate) return alert("날짜를 선택해 주세요!");

    const reservationInfo = {
      date: selectedDate.toDateString(),
      time: selectedTime,
      people: selectedPeople,
    };

    alert(
      `✅ 예약 정보:\n\n📅 날짜: ${reservationInfo.date}\n⏰ 시간: ${reservationInfo.time}\n👤 인원: ${reservationInfo.people}명`
    );
    closeModal(); // 예약 후 모달 닫기
  };

  return (
    <Modal
      width="400px"
      height="600px"
      close={
        <button onClick={closeModal} className="text-main font-bold text-xl inset-0 z-50">
          X
        </button>
      }
      footer={
        <RoundedBtn
          text="예약하기"
          onClick={handleReservation}
          bgColor="bg-main"
          textColor="text-white"
          borderColor="border-main"
          hoverColor="hover:bg-white"
          hoverTextColor="hover:text-main"
          hoverBorderColor="hover:border-main"
          width="w-full"
        />
      }
    >
      <div className="mt-8 flex items-center justify-center">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          selectRange={false}
        />
      </div>

      {/* 인원수 선택 */}
      <div className="mt-4">
        <p className="ml-2 font-semibold">인원수</p>
        <div className="flex justify-start space-x-4 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
          {[1, 2, 3, 4, 5, 6].map((people) => (
            <button
              key={people}
              onClick={() => handlePeopleSelect(people)}
              className={`px-4 py-2 rounded-full border-2 transition-all ${
                selectedPeople === people
                  ? "bg-main text-white border-main"
                  : "text-main border-main"
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
        <div className="flex justify-start space-x-4 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
          {["11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className={`px-4 py-2 rounded-full border-2 transition-all ${
                selectedTime === time
                  ? "bg-main text-white border-main"
                  : "text-main border-main"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
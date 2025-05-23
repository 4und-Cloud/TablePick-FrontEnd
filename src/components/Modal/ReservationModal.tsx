import Modal from "./Modal"
import RoundedBtn from "../Button/RoundedBtn"
import Calendar, {type CalendarProps} from "react-calendar"
import {useState} from "react"
import useAuth from "../../hooks/useAuth"
import "react-calendar/dist/Calendar.css"

interface ReservationModalProps {
    closeModal: () => void
    onSuccess?: () => void
    restaurantId: number
}

export default function ReservationModal({closeModal, onSuccess, restaurantId}: ReservationModalProps) {
    const {user, isAuthenticated} = useAuth()
    const [selectedPeople, setSelectedPeople] = useState<number>(1)
    const [selectedTime, setSelectedTime] = useState<string>("11:00")
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handlePeopleSelect = (people: number) => {
        setSelectedPeople(people)
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

        try {
            setIsSubmitting(true)

            // 예약 정보 생성
            const reservationData = {
                memberId: user.id,
                restaurantId: restaurantId,
                reservationDate: selectedDate.toISOString().split("T")[0],
                reservationTime: selectedTime,
                numberOfPeople: selectedPeople,
            }

            const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL || "http://localhost:8080"

            // 예약 API 호출
            // const response = await fetch("http://localhost:8080/api/reservations", {
            const response = await fetch(`${apiUrl}/api/reservations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reservationData),
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("예약 처리 중 오류가 발생했습니다.")
            }

            const result = await response.json()

            // 예약 성공 후 알림 스케줄링 API 호출
            // await fetch(`http://localhost:8080/api/notifications/schedule/reservation/${result.id}`, {
            await fetch(`${apiUrl}/api/notifications/schedule/reservation/${result.id}`, {
                method: "POST",
                credentials: "include",
            })

            // 성공 콜백 호출
            if (onSuccess) {
                onSuccess()
            } else {
                alert(
                    `✅ 예약 완료:\n\n📅 날짜: ${selectedDate.toLocaleDateString()}\n⏰ 시간: ${selectedTime}\n👤 인원: ${selectedPeople}명`,
                )
                closeModal()
            }
        } catch (error) {
            console.error("예약 처리 중 오류:", error)
            alert("예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.")
        } finally {
            setIsSubmitting(false)
        }
    }

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
                    text={isSubmitting ? "예약 처리 중..." : "예약하기"}
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
                    minDate={new Date()} // 오늘 이후 날짜만 선택 가능
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
                    {["11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((time) => (
                        <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`px-4 py-2 rounded-full border-2 transition-all ${
                                selectedTime === time ? "bg-main text-white border-main" : "text-main border-main"
                            }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
        </Modal>
    )
}


// import Modal from "./Modal";
// import RoundedBtn from "../Button/RoundedBtn";
// import Calendar, { CalendarProps } from "react-calendar";
// import { useState } from "react";
//
// interface ReservationModalProps {
//   closeModal: () => void;
// }
//
// export default function ReservationModal({ closeModal }: ReservationModalProps) {
//   const [selectedPeople, setSelectedPeople] = useState<number>(1);
//   const [selectedTime, setSelectedTime] = useState<string>("11:00");
//   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
//
//   const handlePeopleSelect = (people: number) => {
//     setSelectedPeople(people);
//   };
//
//   const handleTimeSelect = (time: string) => {
//     setSelectedTime(time);
//   };
//
//   const handleDateChange: CalendarProps["onChange"] = (value) => {
//     if (value instanceof Date) {
//       setSelectedDate(value);
//     } else if (Array.isArray(value) && value[0] instanceof Date) {
//       setSelectedDate(value[0]);
//     }
//   };
//
//   const handleReservation = () => {
//     if (!selectedDate) return alert("날짜를 선택해 주세요!");
//
//     const reservationInfo = {
//       date: selectedDate.toDateString(),
//       time: selectedTime,
//       people: selectedPeople,
//     };
//
//     alert(
//       `✅ 예약 정보:\n\n📅 날짜: ${reservationInfo.date}\n⏰ 시간: ${reservationInfo.time}\n👤 인원: ${reservationInfo.people}명`
//     );
//     closeModal(); // 예약 후 모달 닫기
//   };
//
//   return (
//     <Modal
//       width="400px"
//       height="600px"
//       close={
//         <button onClick={closeModal} className="text-main font-bold text-xl inset-0 z-50">
//           X
//         </button>
//       }
//       footer={
//         <RoundedBtn
//           text="예약하기"
//           onClick={handleReservation}
//           bgColor="bg-main"
//           textColor="text-white"
//           borderColor="border-main"
//           hoverColor="hover:bg-white"
//           hoverTextColor="hover:text-main"
//           hoverBorderColor="hover:border-main"
//           width="w-full"
//         />
//       }
//     >
//       <div className="mt-8 flex items-center justify-center">
//         <Calendar
//           onChange={handleDateChange}
//           value={selectedDate}
//           selectRange={false}
//         />
//       </div>
//
//       {/* 인원수 선택 */}
//       <div className="mt-4">
//         <p className="ml-2 font-semibold">인원수</p>
//         <div className="flex justify-start space-x-4 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
//           {[1, 2, 3, 4, 5, 6].map((people) => (
//             <button
//               key={people}
//               onClick={() => handlePeopleSelect(people)}
//               className={`px-4 py-2 rounded-full border-2 transition-all ${
//                 selectedPeople === people
//                   ? "bg-main text-white border-main"
//                   : "text-main border-main"
//               }`}
//             >
//               {people}
//             </button>
//           ))}
//         </div>
//       </div>
//
//       {/* 시간 선택 */}
//       <div className="mt-6">
//         <p className="ml-2 font-semibold">시간</p>
//         <div className="flex justify-start space-x-4 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
//           {["11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((time) => (
//             <button
//               key={time}
//               onClick={() => handleTimeSelect(time)}
//               className={`px-4 py-2 rounded-full border-2 transition-all ${
//                 selectedTime === time
//                   ? "bg-main text-white border-main"
//                   : "text-main border-main"
//               }`}
//             >
//               {time}
//             </button>
//           ))}
//         </div>
//       </div>
//     </Modal>
//   );
// }

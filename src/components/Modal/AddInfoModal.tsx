
import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import RoundedBtn from "../Button/RoundedBtn";
import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import FilterModal from "./FilterModal";
import useAuth from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";
import 'react-calendar/dist/Calendar.css';

// 유저 정보 인터페이스 정의
interface UserInfo {
  gender?: string;
  birthdate?: string;
  phoneNumber?: string;
  profileImage?: string;
}

// 모달 props 인터페이스 정의
interface AddinfoModalProps {
  isOpen: boolean; // 모달 열림/닫힘 상태
  onClose: () => void; // 모달 닫기 콜백
}

// 추가 정보 입력 모달 컴포넌트
export default function AddinfoModal({ isOpen, onClose }: AddinfoModalProps) {
  // 상태 정의
  const [date, setDate] = useState<Date | null>(null); // 생년월일
  const [calOpen, setCalOpen] = useState(false); // 캘린더 표시 여부
  const [gender, setGender] = useState<'male' | 'female'>(); // 성별
  const [phone, setPhone] = useState(''); // 전화번호
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // 선택된 태그
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // 유저 정보

  // 필터 모달 훅: 태그 선택 모달 관리
  const {
    isOpen: isFilterOpen,
    closeModal: closeFilterModal,
    openModal: openFilterModal,
  } = useModal({ initialState: false });

  // 유저 정보 API 호출
  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/members', {
        headers: { Accept: 'application/json' },
        withCredentials: true,
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('데이터 불러오는 중 에러 발생', error);
    }
  }, []);

  // 모달이 열리면 유저 정보 가져오기
  useEffect(() => {
    if (isOpen) {
      fetchUserInfo();
    }
  }, [isOpen, fetchUserInfo]);

  // 유저 정보가 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (userInfo) {
      setGender(userInfo.gender === 'MALE' ? 'male' : 'female');
      setDate(userInfo.birthdate ? new Date(userInfo.birthdate) : null);
      setPhone(userInfo.phoneNumber || '');
    }
  }, [userInfo]);

  // 캘린더 토글 함수
  const toggleCalendar = () => setCalOpen((prev) => !prev);

  // 날짜 선택 핸들러
  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setDate(value);
      setCalOpen(false);
    }
  };

  // 성별 선택 핸들러
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value as 'male' | 'female');
  };

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 전화번호 입력 핸들러
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(event.target.value);
    setPhone(formatted);
  };

  // 적용 버튼 클릭 시 데이터 저장 및 모달 닫기
  const handleApply = () => {
    const dataToSave = {
      gender,
      birthdate: date ? date.toISOString().slice(0, 10) : '',
      phoneNumber: phone,
      tags: selectedTags,
    };
    localStorage.setItem('userAdditionalInfo', JSON.stringify(dataToSave));
    onClose();
  };

  // 모달이 닫혀 있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <>
      {/* 추가 정보 입력 */}
      <Modal
        onClose={onClose}
        footer={
          <RoundedBtn
            text="적용하기"
            bgColor="bg-main"
            textColor="text-white"
            borderColor="border-main"
            hoverColor="hover:bg-white"
            hoverTextColor="hover:text-main"
            hoverBorderColor="hover:border-main"
            width="w-full"
            onClick={handleApply}
          />
        }
        height="460px"
      >
        <div className="m-3">
          {/* 헤더 */}
          <div>
            <p className="text-main font-bold text-2xl">추가 정보 입력</p>
            <p className="text-gray-500 font-semibold">
              서비스 이용을 위해 추가 정보를 입력해주세요!
            </p>
          </div>

          {/* 성별 */}
          <div className="mt-4">
            <p className="font-semibold text-lg mb-2">성별</p>
            <div className="flex space-x-2">
              <label className="flex items-center space-x-2">
                <input
                  onChange={handleGenderChange}
                  className="text-main border-main focus:ring-main"
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                />
                <span>남성</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  onChange={handleGenderChange}
                  className="text-main border-main focus:ring-main"
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                />
                <span>여성</span>
              </label>
            </div>
          </div>

          {/* 생년월일 */}
          <div className="mt-4">
            <p className="font-semibold text-lg mb-2">생년월일</p>
            <input
              id="birthday"
              type="text"
              value={date ? date.toLocaleDateString() : ''}
              readOnly
              onClick={toggleCalendar}
              placeholder="생일을 선택하세요"
              className="cursor-pointer"
            />
            {calOpen && (
              <Modal onClose={toggleCalendar} width="300px" height="300px">
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  maxDate={new Date()}
                  selectRange={false}
                />
              </Modal>
            )}
          </div>

          {/* 전화번호 */}
          <div className="mt-4">
            <p className="font-semibold text-lg mb-2">전화번호</p>
            <input
              id="phone"
              placeholder="010-0000-0000"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={13}
            />
          </div>

          {/* 태그 선택 섹션 */}
          <div className="mt-4">
            <RoundedBtn
              text="+"
              width="w-[50px]"
              height="h-[30px]"
              bgColor="bg-white"
              textColor="text-black"
              borderColor="border-main"
              hoverColor="hover:bg-white"
              hoverTextColor="hover:text-main"
              hoverBorderColor="hover:border-main"
              onClick={openFilterModal}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 font-semibold bg-main text-white rounded-20 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* 필터 태그 모달 */}
      {isFilterOpen && (
        <FilterModal
          isOpen
          mode="tag"
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          onClose={closeFilterModal}
        />
      )}
    </>
  );
}

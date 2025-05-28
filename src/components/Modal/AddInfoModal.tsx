import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import RoundedBtn from '../Button/RoundedBtn';
import Calendar from 'react-calendar';
import { Value } from 'react-calendar/src/shared/types.js';
import FilterModal from './FilterModal';
import useModal from '../../hooks/useModal';
import useAuth from '../../hooks/useAuth';
import { useTagContext } from '../../store/TagContext';
import 'react-calendar/dist/Calendar.css';

interface AddinfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddinfoModal({ isOpen, onClose }: AddinfoModalProps) {
  const { user, login } = useAuth();
  const { tags } = useTagContext();

  const [date, setDate] = useState<Date | null>(null);
  const [calOpen, setCalOpen] = useState(false);
  const [gender, setGender] = useState<'male' | 'female' | undefined>();
  const [phone, setPhone] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const {
    isOpen: isFilterModalOpen,
    openModal: openFilterModal,
    closeModal: closeFilterModal,
  } = useModal({
    initialState: false,
  });

  console.log('useModal:', useModal());

  useEffect(() => {
    if (isOpen && user) {
      console.log('user : ', user);
      setGender(
        user.gender === 'MALE'
          ? 'male'
          : user.gender === 'FEMALE'
            ? 'female'
            : undefined
      );
      setDate(user.birthdate ? new Date(user.birthdate) : null);
      setPhone(user.phoneNumber || '');
      if (Array.isArray(user.memberTags)) {
        setSelectedTagIds(user.memberTags.map((id: string | number) => Number(id)));
      } else {
        setSelectedTagIds([]);
      }
    }
  }, [isOpen, user]);

  const toggleCalendar = () => setCalOpen((prev) => !prev);

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setDate(value);
      setCalOpen(false);
    }
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value as 'male' | 'female');
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(event.target.value);
    setPhone(formatted);
  };

  const handleApply = async () => {
    try {
      const apiUrl = 'http://localhost:8080';
      const updatedData = {
        gender:
          gender === 'male' ? 'MALE' : gender === 'female' ? 'FEMALE' : '',
        birthdate: date ? date.toISOString().slice(0, 10) : '',
        phoneNumber: phone,
        memberTags: selectedTagIds,
      };

      await axios.post(`${apiUrl}/api/members`, updatedData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (!user) { // user가 null일 경우 대비
          console.error('사용자 정보가 없어 추가 정보를 저장할 수 없습니다.');
          alert('사용자 정보가 없어 추가 정보를 저장할 수 없습니다. 다시 로그인해주세요.');
          return;
      }

      const updatedUserInfo = {
        ...user!,
        gender: updatedData.gender,
        birthdate: updatedData.birthdate,
        phoneNumber: updatedData.phoneNumber,
        memberTags: selectedTagIds,
        isNewUser: false,
      };

      login(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      onClose();
    } catch (error) {
      console.error('정보 저장 실패:', error);
      alert('정보 저장에 실패했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
        height="560px"
      >
        <div className="m-3 space-y-4">
          <div>
            <p className="text-main font-bold text-2xl">추가 정보 입력</p>
            <p className="text-gray-500 font-semibold">
              서비스 이용을 위해 추가 정보를 입력해주세요!
            </p>
          </div>

          {/* 성별 */}
          <div>
            <p className="font-semibold text-lg mb-2">성별</p>
            <div className="flex space-x-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={handleGenderChange}
                />
                남성
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={handleGenderChange}
                />
                여성
              </label>
            </div>
          </div>

          {/* 생년월일 */}
          <div>
            <p className="font-semibold text-lg mb-2">생년월일</p>
            <div className="relative">
              <input
                type="text"
                value={date ? date.toISOString().slice(0, 10) : ''}
                readOnly
                onClick={toggleCalendar}
                className="w-full border p-2 rounded"
              />
              {calOpen && (
                <div className="absolute z-10 mt-2">
                  <Calendar onChange={handleDateChange} value={date} />
                </div>
              )}
            </div>
          </div>

          {/* 전화번호 */}
          <div>
            <p className="font-semibold text-lg mb-2">전화번호</p>
            <input
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full border p-2 rounded"
              placeholder="010-1234-5678"
            />
          </div>

          {/* 태그 선택 */}
          <div>
            <p className="font-semibold text-lg mb-2">관심 카테고리</p>
            <button
              onClick={openFilterModal}
              className="px-3 py-1 rounded border border-main text-main hover:bg-main hover:text-white transition"
            >
              태그 선택하기
            </button>

            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTagIds.map((id) => {
                const tag = tags.find((tag) => tag.id === id);
                return tag ? (
                  <span
                    key={id}
                    className="bg-main text-white px-2 py-1 rounded text-sm"
                  >
                    {tag.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </Modal>

      <FilterModal
        isOpen={isFilterModalOpen}
        selectedTags={selectedTagIds}
        setSelectedTags={setSelectedTagIds}
        onClose={() => {
          console.log('FilterModal 닫기 호출');
          closeFilterModal();
        }}
        onClick={() => {
          console.log('FilterModal 적용, 선택된 태그:', selectedTagIds);
          closeFilterModal();
        }}
      />
    </>
  );
}

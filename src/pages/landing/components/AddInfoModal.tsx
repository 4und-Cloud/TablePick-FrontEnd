import React, { useState, useEffect } from 'react';
import Modal from '../../../@shared/components/Modal/Modal';
import RoundedBtn from '../../../@shared/components/Button/RoundedBtn';
import FilterModal from '../../../@shared/components/Modal/FilterModal';
import useModal from '../../../@shared/hook/useModal';
import useAuth from '@/features/auth/hook/useAuth'
import { useTagContext } from '../../../app/provider/TagContext';
import api from '../../../@shared/api/api';

interface AddinfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddinfoModal({ isOpen, onClose }: AddinfoModalProps) {
  const { user, login } = useAuth();
  const { tags } = useTagContext();

  const [date, setDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<'male' | 'female' | undefined>();
  const [phone, setPhone] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  const {
    isOpen: isFilterModalOpen,
    openModal: openFilterModal,
    closeModal: closeFilterModal,
  } = useModal({
    initialState: false,
  });


  useEffect(() => {
    if (isOpen && user) {
      setGender(
        user.gender === 'MALE'
          ? 'male'
          : user.gender === 'FEMALE'
            ? 'female'
            : undefined
      );
      setDate(user.birthdate ? new Date(user.birthdate) : null);
      const formattedPhone = user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : '';
      setPhone(formattedPhone);
      setIsPhoneValid(formattedPhone ? isValidPhoneNumber(formattedPhone) : true);
      if (Array.isArray(user.memberTags)) {
        setSelectedTagIds(user.memberTags.map((id: string | number) => Number(id)));
      } else {
        setSelectedTagIds([]);
      }
    }
  }, [isOpen, user]);

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
    const input = event.target.value.replace(/\D/g, '');
    const formatted = formatPhoneNumber(input);
    setPhone(formatted);
    setIsPhoneValid(isValidPhoneNumber(formatted) || formatted.length < 12);
  };

  const handleApply = async () => {
    if (!gender || !date || phone.trim() === '' || selectedTagIds.length === 0 || !isValidPhoneNumber(phone)) {
      alert('모든 폼을 다 채워주세요! 전화번호는 010-1234-5678 형식이어야 합니다.');
      return;
    };
    try {
      const updatedData = {
        gender:
          gender === 'male' ? 'MALE' : gender === 'female' ? 'FEMALE' : '',
        birthdate: date ? date.toISOString().slice(0, 10) : '',
        phoneNumber: phone,
        memberTags: selectedTagIds,
      };

      await api.post(`/api/members`, updatedData);

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
    
      sessionStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
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
            <label htmlFor='birth' className="font-semibold text-lg mb-2">생년월일</label>
            <div className="relative">
              <input
                type="date"
                id='birth'
                name='birthdate'
                value={date ? date.toISOString().slice(0, 10) : ''}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="w-full border p-2 rounded"
              />
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
            {!isPhoneValid && phone.length >= 12 && (
              <p className='text-red-500 text-sm mt-1'>유효한 전화번호 형식이 아닙니다. (010-1234-5678)</p>
            )}
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
          closeFilterModal();
        }}
        onClick={() => {
          closeFilterModal();
        }}
      />
    </>
  );
}

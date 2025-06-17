<<<<<<< HEAD:src/pages/Mypage.tsx




import { useState, useEffect } from "react";
import { useUserExtraInfo } from "../store/UserInfoContext"
import go5rae from '@/assets/images/profile_img.jpg';
//import FilterModal from "../components/Modal/FilterModal";
//import useModal from "../hooks/useModal";
import useAuth from "../hooks/useAuth";
import defaultProfile from '@/assets/images/user.png';
import { useTagContext } from "../store/TagContext";
import api from "../lib/api";
=======
import { useState, useEffect, useMemo } from "react";
import FilterModal from "../../@shared/components/Modal/FilterModal";
import useModal from "../../@shared/hook/useModal";
import useAuth from '@/features/auth/hook/useAuth'
import defaultProfile from '@/@shared/images/user.png';
import { useTagQuery } from "@/entities/tag/hook/useTagQuery";
import { fetchUpdatedMemberInfo } from "@/features/member/api/fetchMember";
import { MemberFormData } from "@/features/member/types/memberType";

type Gender = '' | 'male' | 'female';

interface MypageUserInfo {
  id: number;
  profileImage : string;
  nickname: string;
  email: string;
	gender?: string;
  birthdate?: string;
  phoneNumber?: string;
  memberTags?: number[];
  createAt?: string;
  isNewUser?: boolean;
}

// gender 값을 정규화하는 함수
const normalizeGender = (gender?: string): Gender => {
  if (!gender) return '';
  const normalized = gender.toUpperCase();
  return normalized === 'MALE' ? 'male' : normalized === 'FEMALE' ? 'female' : '';
};

const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-1|6-9]-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
};

const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7)
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

export default function Mypage() {
  const { data: tagsItem, isLoading, isError } = useTagQuery();
  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>태그 데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!tagsItem) return null;
  const {user, login} = useAuth();
  const {isOpen, openModal, closeModal} = useModal({initialState: false});
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [initialFormData, setInitialFormData] = useState<MypageUserInfo | null>(null);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const [formData, setFormData] = useState<MypageUserInfo>({
    id: 0, // 기본값 설정
    profileImage: defaultProfile,
    nickname: '',
    email: '',
    gender: '',
    birthdate: '',
    phoneNumber: '',
    memberTags: [], // 빈 배열로 초기화
    createAt: '',
    isNewUser: false,
  });

	const tagNames = useMemo(() => {
  return (formData.memberTags || []).map(tagId => {
    const match = tagsItem.find(tag => tag.id === tagId);
    return match ? match.name : '';
  });
  }, [formData.memberTags, tagsItem]);
  
  useEffect(() => {
    if (user) { // user 객체가 null이 아닐 때만 실행
      const formattedPhone = user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : '';
      const newFormData: MypageUserInfo = {
        id: user.id,
        profileImage: user.profileImage && user.profileImage !== "" ? user.profileImage : defaultProfile,
        nickname: user.nickname,
        email: user.email,
        gender: normalizeGender(user.gender),
        birthdate: user.birthdate || '',
        phoneNumber: formattedPhone,
        memberTags: user.memberTags || [],
        createAt: user.createAt || '',
        isNewUser: user.isNewUser || false,
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
      setSelectedTags(newFormData.memberTags || []);
      setIsPhoneValid(formattedPhone ? isValidPhoneNumber(formattedPhone) : true);
    }
  }, [user, setFormData, setInitialFormData, setSelectedTags]);

	const handleTagAdd = () => {
		setFormData((prev) => {
			const updatedFormData = {
				...prev,
				memberTags: selectedTags
      };
      return updatedFormData;
    });
    if (user) {
        const updatedUser : MypageUserInfo = {
          ...user,
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          profileImage: user.profileImage,
          gender: user.gender,
          memberTags: selectedTags,
          birthdate: user.birthdate,
          phoneNumber: user.phoneNumber,
          createAt: user.createAt,
          isNewUser: user.isNewUser,
        };
         login(updatedUser);
      }
		closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const formatted = formatPhoneNumber(value);
      setFormData(prevState => ({
      ...prevState,
      [name]: formatted,
      }));
      setIsPhoneValid(isValidPhoneNumber(formatted) || formatted.length < 12);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
	};
	
	const handleCancel = () => {
		if (initialFormData) {
			setFormData(initialFormData);
			setSelectedTags(initialFormData.memberTags || []);
		}
		alert('수정이 취소되었습니다');
	};

  const handleSave = async () => {
    if (!isValidPhoneNumber(formData.phoneNumber || '')) {
      alert('전화번호는 010-XXXX-XXXX 형식이어야 합니다.');
      return;
    }
  const convertedGender = formData.gender
    ? formData.gender.toUpperCase() as 'MALE' | 'FEMALE'
    : '';

    const memberFormData: MemberFormData = {
    nickname: formData.nickname,
    gender: convertedGender,
    birthdate: formData.birthdate || '', // 기본값으로 빈 문자열
    phoneNumber: formData.phoneNumber || '', // 기본값으로 빈 문자열
    profileImage: formData.profileImage || defaultProfile,
    memberTags: formData.memberTags || [], // 기본값으로 빈 배열
  };

		try {
      const updatedData = await fetchUpdatedMemberInfo(memberFormData);
      
      const updatedMemberTags = updatedData?.data?.memberTags
      ? updatedData.data.memberTags.map((tag: any) => tag.id)
      : formData.memberTags || [];

      sessionStorage.setItem('userInfo', JSON.stringify({
				...formData,
				memberTags: updatedMemberTags
			}));

      const updatedUser: MypageUserInfo = {
        ...user,
        id: user.id,
        nickname: formData.nickname,
        gender: convertedGender,
        birthdate: formData.birthdate,
        phoneNumber: formData.phoneNumber,
        profileImage: formData.profileImage || defaultProfile,
        memberTags: updatedMemberTags,
        createAt: user.createAt,
        isNewUser: user.isNewUser,
      };
      login(updatedUser);
			
			setInitialFormData(formData);
			alert('정보 저장 완료');
		} catch (error) {
			console.error('유저 정보 저장 실패 :', error);
			alert('정보 저장 실패');
		}
  };

	return (
		<>
			<div className="mt-[80px] max-w-3xl mx-auto p-6 bg-white rounded-md shadow relative">
        <h2 className="text-xl font-bold text-orange-500 mb-6">회원 정보 수정</h2>

        {/* 좌측: 이미지와 관심 태그 */}
        <div className="flex items-start mb-6 space-x-6">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0">
            <img
              width={32}
              height={32}
              src={formData.profileImage || defaultProfile}
              alt="Profile"
              className="w-32 h-32 rounded-full"
            />
          </div>

                {/* 관심 태그 */}
                <div className="flex-grow">
                    <div className="mb-4">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">관심 태그</label>
                        
                        <div className="mt-2 relative">
                            <div className="flex flex-wrap gap-2 pr-12 max-h-32 overflow-y-auto rounded pt-2 ">
                                {formData.tags.length > 0 ? (
                                    
                                    formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-block px-4 py-2 text-white bg-main rounded-full text-sm min-w-max"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500">선택된 태그가 없습니다.</p>
                                )}
                            </div>
                            
                <button
                  type="button"
                  onClick={() => {
                    // user가 null이 아닐 때만 memberTags 접근
                    if (user && user.memberTags) {
                      setSelectedTags(user.memberTags); 
                    } else {
                      setSelectedTags([]); // user 또는 memberTags가 없으면 빈 배열로
                    }
                    openModal();
                  }}
                  className="px-3 bg-main text-white rounded-full text-lg absolute right-0 top-1/2 -translate-y-1/2"
                >
                	+
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: form */}
        <div>
          <div className="mb-4">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">이름</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded"
              readOnly
            />
        	</div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">성별</label>
            <div className="flex items-center">
              <label className="mr-5">
                <input
                  className="mr-2"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                /> 남성
              </label>
              <label>
                <input
                	className="mr-2"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                /> 여성
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="birth" className="block text-sm font-medium text-gray-700">생일</label>
            <input
              type="date"
              id="birth"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">전화번호</label>
            <input
              type="tel"
              id="phone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`mt-2 p-2 w-full border rounded ${isPhoneValid ? 'border-gray-300' : 'border-red-500'}`}
              placeholder="010-1234-5678"
            />
            {!isPhoneValid && formData.phoneNumber && formData.phoneNumber.length >= 12 && (
              <p className="text-red-500 text-sm mt-1">유효한 전화번호 형식이 아닙니다. (010-XXXX-XXXX)</p>
            )}
          </div>  

                

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => alert("수정이 취소되었습니다.")}
                        className="px-4 py-2 bg-gray-300 rounded text-sm text-gray-700"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-orange-500 text-white rounded text-sm"
                    >
                        저장
                    </button>
                </div>
            </div>

            
        </div>
    );
}

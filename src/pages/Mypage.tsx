import { useState, useEffect } from "react";
import { useUserExtraInfo } from "../store/UserInfoContext"
import go5rae from '@/assets/images/profile_img.jpg';
//import FilterModal from "../components/Modal/FilterModal";
//import useModal from "../hooks/useModal";
import useAuth from "../hooks/useAuth";
import defaultProfile from '@/assets/images/user.png';
import { useTagContext } from "../store/TagContext";
import api from "../lib/api";

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

export default function Mypage() {
	const { tags } = useTagContext();
  const {user, login} = useAuth();
  const {isOpen, openModal, closeModal} = useModal({initialState: false});
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
	const [initialFormData, setInitialFormData] = useState<MypageUserInfo | null>(null);

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
    const match = tags.find(tag => tag.id === tagId);
    return match ? match.name : '';
  });
  }, [formData.memberTags, tags]);
  
  useEffect(() => {
    if (user) { // user 객체가 null이 아닐 때만 실행
      const newFormData: MypageUserInfo = {
        id: user.id,
        profileImage: user.profileImage || defaultProfile,
        nickname: user.nickname,
        email: user.email,
        gender: normalizeGender(user.gender),
        birthdate: user.birthdate || '',
        phoneNumber: user.phoneNumber || '',
        memberTags: user.memberTags || [],
        createAt: user.createAt || '',
        isNewUser: user.isNewUser || false,
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
      setSelectedTags(newFormData.memberTags || []);
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
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
	};
	
	const handleCancel = () => {
		if (initialFormData) {
			setFormData(initialFormData);
			setSelectedTags(initialFormData.memberTags || []);
		}
		alert('수정이 취소되었습니다');
	};

	const handleSave = async () => {
		try {
			const requestBody = {
      nickname: formData.nickname,
      gender: formData.gender?.toUpperCase() || '',
      birthdate: formData.birthdate,
      phoneNumber: formData.phoneNumber,
      profileImage: formData.profileImage || defaultProfile,
      memberTagsId : formData.memberTags
			};
      const res = await api.patch(`/api/members`, requestBody);

      localStorage.setItem('userInfo', JSON.stringify({
				...formData,
				memberTags: res.data.memberTags?.map((tag: any) => tag.id) || formData.memberTags || [],
			}));

      const updatedUser: MypageUserInfo = {
        ...user,
        id: user.id,
        nickname: formData.nickname,
        gender: formData.gender ? formData.gender.toUpperCase() : undefined,
        birthdate: formData.birthdate,
        phoneNumber: formData.phoneNumber,
        profileImage: formData.profileImage || defaultProfile,
        memberTags: formData.memberTags,
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
                        className="mt-2 p-2 w-full border border-gray-300 rounded"
                    />
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

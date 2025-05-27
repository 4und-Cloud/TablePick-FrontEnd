import { useState, useEffect, useMemo } from "react";
import FilterModal from "../components/Modal/FilterModal";
import useModal from "../hooks/useModal";
import useAuth from "../hooks/useAuth";
import defaultProfile from '@/assets/images/user.png';
import { useTagContext } from "../store/TagContext";
import { deflate } from "zlib";

type Gender = '' | 'male' | 'female';

interface MypageUserInfo {
  profileImage? : string;
  nickname?: string;
  email?: string;
	gender: Gender;
  birthdate: string;
  phoneNumber: string;
  memberTags: number[];
}

// gender 값을 정규화하는 함수
const normalizeGender = (gender?: string): Gender => {
  if (!gender) return '';
  const normalized = gender.toUpperCase();
  return normalized === 'MALE' ? 'male' : normalized === 'FEMALE' ? 'female' : '';
};

export default function Mypage() {
	const { tags } = useTagContext();
  const {user} = useAuth();
  const {isOpen, openModal, closeModal} = useModal({initialState: false});
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
	const [initialFormData, setInitialFormData] = useState<MypageUserInfo | null>(null);

  const [formData, setFormData] = useState<MypageUserInfo>({
    profileImage: user.profileImage || defaultProfile,
    nickname: user.nickname || '',  // 더미 이름
    email: user.email || '',  // 더미 이메일
		gender: normalizeGender(user?.gender),
    birthdate: user.birthdate || '',
    phoneNumber: user.phoneNumber || '',
    memberTags: user.memberTags?.map((tag: any) => tag.id) || [],
	});
	
	const tagNames = useMemo(() => {
  return (formData.memberTags || []).map(tagId => {
    const match = tags.find(tag => tag.id === tagId);
    return match ? match.name : '';
  });
	}, [formData.memberTags, tags]);

  useEffect(() => {
		// 1. userInfo가 있으면 우선 불러오기
		const savedUserInfo = localStorage.getItem('userInfo');
		
		if (savedUserInfo) {
			let parsedUserInfo : MypageUserInfo = JSON.parse(savedUserInfo);
			// user와 이메일이 다르면 user로 덮어쓰기
			if (user && parsedUserInfo.email !== user.email) {
				const newFormData = {
					profileImage: user.profileImage || defaultProfile,
					nickname: user.nickname || '',
					email: user.email || '',
					gender: normalizeGender(user.gender),
					birthdate: user.birthdate || '',
					phoneNumber: user.phoneNumber || '',
					memberTags: user.memberTags || [],
				};
				setFormData(newFormData);
				setInitialFormData(newFormData);
			} else {
				const normalizedData = {
					...parsedUserInfo,
					gender: normalizeGender(parsedUserInfo.gender),
				};
				setFormData(normalizedData);
				setInitialFormData(normalizedData);
			}
		} else if (user) {
			// 3. 저장된 데이터 없으면 user 기본값 세팅
			setFormData({
				profileImage: user.profileImage || defaultProfile,
				nickname: user.nickname || '',
				email: user.email || '',
				gender: normalizeGender(user.gender),
				birthdate: user.birthdate || '',
				phoneNumber: user.phoneNumber || '',
				memberTags: user.memberTags || [],
			});
  	}
	}, [user]);

	const handleTagAdd = () => {
		setFormData((prev) => {
			const updatedFormData = {
				...prev,
				memberTags: selectedTags.map(Number)
			};
			localStorage.setItem('userInfo', JSON.stringify(updatedFormData));
			return updatedFormData;
		});
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
			setSelectedTags(initialFormData.memberTags);
		}
		alert('수정이 취소되었습니다');
	};

	const handleSave = async () => {
		try {
			const apiUrl = 'http://localhost:8080';
			const requestBody = {
      nickname: formData.nickname,
      gender: formData.gender.toUpperCase(),
      birthdate: formData.birthdate,
      phoneNumber: formData.phoneNumber,
      profileImage: formData.profileImage || defaultProfile,
      memberTagsId : formData.memberTags
			};
			console.log('req body :', requestBody, null, 2);
			const res = await fetch(`${apiUrl}/api/members`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Accept' : 'application/json'
				},
				credentials : 'include',
				body: JSON.stringify(requestBody),
			});

			if (!res.ok) {
				const errorData = await res.text();
				console.log('error res : ', errorData);
				throw new Error('유저 정보 저장 실패');
			}
			const text = await res.text();
			if (text) {
				const data = JSON.parse(text);
				console.log('저장 성공 :', data); 
				localStorage.setItem('userInfo', JSON.stringify({
				...formData,
				memberTags: data.memberTags?.map((tag: any) => tag.id) || formData.memberTags,
			}));
			} else {
				console.log('저장 성공');
				localStorage.setItem('userInfo', JSON.stringify(formData));
			}
			
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
                  {tagNames.length > 0 ? (                  
                    tagNames.map((tag, index) => (
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
                  onClick={() => {setSelectedTags(formData.memberTags); openModal();}}
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
              onClick={handleCancel}
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
			<FilterModal
				isOpen={isOpen}
				selectedTags={selectedTags}
				setSelectedTags={setSelectedTags}
				onClose={() => {
					closeModal();
				}}
				onClick={handleTagAdd}
			/>
		</>    
  );
}

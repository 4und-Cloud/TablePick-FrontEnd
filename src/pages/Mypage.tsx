import { useState, useEffect } from "react";
import { useUserExtraInfo } from "../store/UserInfoContext"
import go5rae from '@/assets/images/profile_img.jpg';
import FilterModal from "../components/Modal/FilterModal";
import useModal from "../hooks/useModal";
import useAuth from "../hooks/useAuth";

interface MypageUserInfo {
    profileImg? : string;
    name?: string;
    email?: string;
    gender: 'male' | 'female';
    birthdate: string;
    phoneNumber: string;
    tags: string[];
}

export default function Mypage() {
    const {user} = useAuth();

    const {isOpen, openModal, closeModal} = useModal({initialState: false});

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const { userInfo, setUserInfo } = useUserExtraInfo();
    const [formData, setFormData] = useState<MypageUserInfo>({
        profileImg: go5rae,
        name: 'go5rae',  // 더미 이름
        email: 'coqnrl115@naver.com',  // 더미 이메일
        gender: 'male',
        birthdate: '',
        phoneNumber: '',
        tags: []
    });

    useEffect(() => {
        const savedAdditionalData = localStorage.getItem('userAdditionalInfo');
        const savedBasicData = localStorage.getItem('userInfo');
      
        console.log("🟡 userInfo from context:", userInfo);
        console.log("🟢 savedAdditionalData:", savedAdditionalData);
        console.log("🔵 savedBasicData:", savedBasicData);
      
        if (savedAdditionalData) {
          const parsedAdditional = JSON.parse(savedAdditionalData);
          console.log("✅ parsedAdditional.profileImg:", parsedAdditional.profileImg);
          setFormData(parsedAdditional);
        } else if (userInfo) {
          console.log("✅ userInfo.profileImage:", userInfo.profileImage);
          setFormData({
            gender: userInfo.gender as 'male' | 'female',
            birthdate: userInfo.birthdate || '',
            phoneNumber: userInfo.phoneNumber || '',
            tags: userInfo.tags || [],
          });
        }
      }, [userInfo]);
      


    const handleTagAdd = () => {
        setFormData(prev => ({
          ...prev,
          tags: selectedTags
        }));
        closeModal();
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        setUserInfo(formData);
        localStorage.setItem('userAdditionalInfo', JSON.stringify(formData)); // 저장
        alert('정보 저장 완료');
    };



    return (
        <div className="mt-[120px] max-w-3xl mx-auto p-6 bg-white rounded-md shadow relative">
            <h2 className="text-xl font-bold text-orange-500 mb-6">회원 정보 수정</h2>

            {/* 좌측: 이미지와 관심 태그 */}
            <div className="flex items-start mb-6 space-x-6">
                {/* 프로필 이미지 */}
                <div className="flex-shrink-0">
                    <img
                        src={user.image || go5rae}
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
                            onClick={() => {setSelectedTags(formData.tags); openModal();}}
                            className="px-3 bg-main text-white rounded-full text-lg absolute right-0 top-1/2 -translate-y-1/2"
                        >
                            +
                        </button>
                        </div>
                        
                        {isOpen && (<FilterModal mode="tag" selectedTags={selectedTags} setSelectedTags={setSelectedTags} onClick={handleTagAdd} onClose={closeModal} />)}
                    </div>
                </div>
            </div>

            {/* 우측: form */}
            <div>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
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
                        value={user.email}
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

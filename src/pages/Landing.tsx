import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextBtn from '../components/Button/TextBtn';
import RoundedBtn from '../components/Button/RoundedBtn';
import Modal from '../components/Modal';
import useModal from '../hooks/useModal';
import FilterModal from '../components/FilterModal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import placeImg from '@/assets/images/place.png';
import locImg from '@/assets/images/location.png';
import chqkqImg from '@/assets/images/chqkq.jpg';

// 사용자 정보 인터페이스
interface UserInfo {
  gender?: 'male' | 'female';
  birthDate?: string;
  phone?: string;
  tags?: string[];
}

// 더미 데이터
const dummy = [
  { restaurantName: '센시티브서울', image: placeImg, id: 1 },
  { restaurantName: '센시티브서울', image: chqkqImg, id: 2 },
  { restaurantName: '센시티브서울', image: placeImg, id: 3 },
  { restaurantName: '센시티브서울', image: placeImg, id: 4 },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal({ initialState: false });
  //const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal({ initialState: false });

  // 상태 관리
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCalendarOpen, setCalendarOpen] = useState<boolean>(false);

  // 초기 사용자 정보 조회
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const { data } = await axios.get<UserInfo>('/api/user/info');
        setUserInfo(data);
        if (data.gender) setGender(data.gender);
        if (data.birthDate) setBirthDate(new Date(data.birthDate));
        if (data.phone) setPhone(data.phone);
        if (data.tags) setSelectedTags(data.tags);

        const incomplete = !data.gender || !data.birthDate || !data.phone || !data.tags || data.tags.length === 0;
        if (incomplete) openModal();
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        openModal();
      }
    }
    fetchUserInfo();
  }, [openModal]);

  // 추가 정보 저장
  const handleSubmitUserInfo = async () => {
    try {
      await axios.post('/api/user/info', {
        gender,
        birthDate: birthDate?.toISOString().split('T')[0],
        phone,
        tags: selectedTags,
      });
      closeModal();
    } catch (error) {
      console.error('추가 정보 저장 실패:', error);
    }
  };

  // 성별 변경
  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value as 'male' | 'female');
  };

  // 전화번호 포맷팅
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = e.target.value.replace(/\D/g, '');
    let formatted = nums;
    if (nums.length < 4) {
      formatted = nums;
    } else if (nums.length < 7) {
      formatted = `${nums.slice(0, 3)}-${nums.slice(3)}`;
    } else if (nums.length <= 11) {
      formatted = `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
    }
    setPhone(formatted);
  };

  // 캘린더 토글
  const toggleCalendar = () => setCalendarOpen(prev => !prev);

  // 날짜 선택
  const handleDateSelect = (date: Date) => {
    setBirthDate(date);
    setCalendarOpen(false);
  };

  // 게시글 상세 이동
  const handlePostDetail = (id: number) => {
    navigate(`/posts/${id}`);
  };

  return (
    <>
      

      <div className="mt-[80px] p-3">
        {/* 추천 매장 섹션 */}
        <div className="mb-10 mt-8">
          <div className="flex justify-between m-4">
            <p className="font-bold text-2xl text-gray-500">고객님이 좋아할 매장</p>
            <TextBtn text="식당 더 보기 ->" onClick={() => navigate('/restaurants')} />
          </div>
          <div className="flex gap-10">
            {dummy.map(item => (
              <div key={item.id} onClick={() => navigate(`/restaurants/${item.id}`)}>
                <img src={item.image} className="w-[250px] h-[250px] rounded-20" />
                <div className="mt-1 flex items-center gap-2">
                  <img src={locImg} className="w-[18px] h-[18px]" />
                  <span className="text-lg font-semibold">{item.restaurantName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 게시글 섹션 */}
        <div>
          <div className="flex justify-between m-4">
            <p className="font-bold text-2xl text-gray-500">고객님이 좋아할 게시글</p>
            <TextBtn text="게시글 더 보기 ->" onClick={() => navigate('/posts')} />
          </div>
          <div className="flex gap-10 mt-2">
            {dummy.map(item => (
              <div key={item.id} onClick={() => handlePostDetail(item.id)}>
                <img src={item.image} className="w-[250px] h-[250px] rounded-20" />
                <div className="mt-1 flex items-center gap-2">
                  <img src={locImg} className="w-[18px] h-[18px]" />
                  <span className="text-lg font-semibold">{item.restaurantName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
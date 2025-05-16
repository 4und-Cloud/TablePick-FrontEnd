import axios from 'axios';
import TextBtn from "../components/Button/TextBtn";
import place from '@/assets/images/place.png';
import loc from '@/assets/images/location.png';
import chqkq from '@/assets/images/chqkq.jpg';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import FilterModal from "../components/FilterModal";
import 'react-calendar/dist/Calendar.css';
import RoundedBtn from "../components/Button/RoundedBtn";
import { profile } from 'console';
import ehzytlwkd from '@/assets/images/ehzytlwkd.jpg'
import dlwlszks from '@/assets/images/dlwlszlsk.jpg';

interface UserInfo {
  gender?: string;
  birthdate? : string;
  phoneNumber? : string;
  profileImage?: string;
}

interface RestaurantItem {
  id: number;
  restaurantName: string;
  imageUrl: string;
}

interface PostItem {
  id: number;
  content: string;
  imageUrl: string;
}

function RestaurantCard({ item, onClick }: { item: RestaurantItem; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <img
        src={item.imageUrl} // image → imageUrl
        className="w-[250px] h-[250px] rounded-20"
        alt={item.restaurantName}
      />
      <div className="mt-1 flex flex-row gap-2 items-center">
        <img src={loc} className="w-[18px] h-[18px]" alt="location icon" />
        <span className="text-lg font-semibold">{item.restaurantName}</span>
      </div>
    </div>
  );
}


const dummy: RestaurantItem[] = [
  { id: 1, restaurantName: '센시티브서울', imageUrl: place },
  { id: 2, restaurantName: '도마29', imageUrl: chqkq },
  { id: 3, restaurantName: '도쿄시장', imageUrl: ehzytlwkd },
  { id: 4, restaurantName: '이진칸', imageUrl: dlwlszks },
];

export default function Landing() {
  const [posts, setPosts] = useState<PostItem[]>([]);

const fetchPosts = useCallback(async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/boards/main', {
      headers: { Accept: 'application/json' },
      withCredentials: true,
    });

    const postsData = res.data.content;

    if (Array.isArray(postsData)) {
      setPosts(postsData);
    } else {
      console.error('게시글 content가 배열이 아닙니다:', postsData);
      setPosts([]);
    }
  } catch (error) {
    console.error('게시글 데이터 가져오기 실패:', error);
    setPosts([]);
  }
}, []);

  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/restaurants/all', {
        headers: { Accept: 'application/json' },
        withCredentials: true,
      });
      
      // content 배열 추출
      const restaurantsData = res.data.content;
  
      // 배열인지 확인
      if (Array.isArray(restaurantsData)) {
        setRestaurants(restaurantsData);
      } else {
        console.error('content가 배열이 아닙니다:', restaurantsData);
        setRestaurants([]);
      }
    } catch (error) {
      console.error('레스토랑 데이터 가져오기 실패:', error);
      setRestaurants([]);
    }
  }, [])

  

  useEffect(() => {
    fetchRestaurants();
    fetchPosts();
  }, [fetchRestaurants, fetchPosts]);

  const navigate = useNavigate();

  const handleRes = () => {navigate('/restaurants')};

  const handlePost = () => {navigate('/posts')};

  const handleResDitail = (id: number) => {navigate(`/restaurants/${id}`)};

  const handlePostDetail = (id: number) => {navigate(`/posts/${id}`)};

  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const location = useLocation();

  const [date, setDate] = useState<Date | null>(null);
  const [calOpen, setCalOpen] = useState(false);

  const [gender, setGender] = useState<'male' | 'female'>();
  const [phone, setPhone] = useState('');

  // 필터 모달 훅 (custom hook)
  const { isOpen: isFilterOpen, closeModal: closeFilterModal, openModal: openFilterModal } = useModal({ initialState: false });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 모달 열기/닫기 메모이제이션
  const openUserInfoModal = useCallback(() => setIsUserInfoModalOpen(true), []);
  const closeUserInfoModal = useCallback(() => setIsUserInfoModalOpen(false), []);

  // 유저 정보 API 호출 (axios)
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

  // 모달 열리면 유저정보 fetch
  useEffect(() => {
    if (isUserInfoModalOpen) {
      fetchUserInfo();
    }
  }, [isUserInfoModalOpen, fetchUserInfo]);

  // userInfo 변하면 내부 상태 세팅
  useEffect(() => {
    if (userInfo) {
      setGender(userInfo.gender === 'MALE' ? 'male' : 'female');
      setDate(userInfo.birthdate ? new Date(userInfo.birthdate) : null);
      setPhone(userInfo.phoneNumber || '');
    }
  }, [userInfo]);

  // react-router의 location.state 에 따라 모달 열기 처리 (showFilterModal flag)
  useEffect(() => {
    if (location.state?.showFilterModal) {
      openUserInfoModal();

      // showFilterModal 삭제하여 상태 초기화
      const newState = { ...location.state };
      delete newState.showFilterModal;
      window.history.replaceState(newState, document.title);
    }
  }, [location.state, openUserInfoModal]);

  // 캘린더 토글
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

  // 전화번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 전화번호 입력 핸들러
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(event.target.value);
    setPhone(formatted);
  }; 

  // 적용 버튼 클릭시 데이터 저장 및 모달 닫기
  const handleApply = () => {
    const dataToSave = {
      gender,
      birthdate: date ? date.toISOString().slice(0,10) : '',
      phoneNumber: phone,
      tags: selectedTags,
    };
    localStorage.setItem('userAdditionalInfo', JSON.stringify(dataToSave));
    closeUserInfoModal();
  };

  return (
    <>
      {/* 유저 정보 입력 모달 */}
      {isUserInfoModalOpen && (
        <Modal
          onClose={closeUserInfoModal}
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
            <div>
              <p className="text-main font-bold text-2xl">추가 정보 입력</p>
              <p className="text-gray-500 font-semibold">서비스 이용을 위해 추가 정보를 입력해주세요!</p>
            </div>

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
      )}

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

      {/* 메인 컨텐츠 */}
      <div className="mt-[80px] p-3">
        {/* 추천 매장 */}
        <section className="mb-10 mt-8">
          <div className="flex justify-between m-4">
            <p className="font-bold text-2xl text-gray-500 ml-2">고객님이 좋아할 매장</p>
            <TextBtn fontSize="text-xl" text="식당 더 보기 ->" onClick={handleRes}/>
          </div>
          <div className="flex justify-center gap-10 flex-wrap">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} item={restaurant} />
            ))}
          </div>
        </section>

        {/* 추천 게시글 */}
        <section>
          <div className="flex justify-between m-4 mb-2">
            <p className="font-bold text-2xl text-gray-500 ml-2">고객님이 좋아할 게시글</p>
            <TextBtn fontSize="text-xl" text="게시글 더 보기 ->" onClick={handlePost} />
          </div>
          <div className="flex justify-center gap-10 flex-wrap">
            {dummy.map((item, idx) => (
              <RestaurantCard key={idx} item={item}/>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

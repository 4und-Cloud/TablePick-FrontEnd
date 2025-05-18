import axios from 'axios';
import TextBtn from "../components/Button/TextBtn";
import place from '@/assets/images/place.png';
import loc from '@/assets/images/location.png';
import chqkq from '@/assets/images/chqkq.jpg';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import AddinfoModal from '../components/AddInfoModal';
import ehzytlwkd from '@/assets/images/ehzytlwkd.jpg';
import dlwlszks from '@/assets/images/dlwlszlsk.jpg';

// 레스토랑 데이터 인터페이스
interface RestaurantItem {
  id: number;
  restaurantName: string;
  imageUrl: string;
}

// 게시글 데이터 인터페이스
interface PostItem {
  id: number;
  content: string;
  imageUrl: string;
}

// 레스토랑 카드 컴포넌트
function RestaurantCard({ item, onClick }: { item: RestaurantItem; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <img
        src={item.imageUrl}
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

// 더미 데이터
const dummy: RestaurantItem[] = [
  { id: 1, restaurantName: '센시티브서울', imageUrl: place },
  { id: 2, restaurantName: '도마29', imageUrl: chqkq },
  { id: 3, restaurantName: '도쿄시장', imageUrl: ehzytlwkd },
  { id: 4, restaurantName: '이진칸', imageUrl: dlwlszks },
];

export default function Landing() {
  // 상태 정의
  const [posts, setPosts] = useState<PostItem[]>([]); // 게시글 목록
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]); // 레스토랑 목록
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false); // 유저 정보 모달 열림 상태

  const navigate = useNavigate();
  const location = useLocation();

  // 게시글 데이터 가져오기
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
        setPosts([]);
      }
    } catch (error) {
      console.error('게시글 데이터 가져오기 실패:', error);
      setPosts([]);
    }
  }, []);

  // 레스토랑 데이터 가져오기
  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/restaurants/all', {
        headers: { Accept: 'application/json' },
        withCredentials: true,
      });

      const restaurantsData = res.data.content;
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
  }, []);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchRestaurants();
    fetchPosts();
  }, [fetchRestaurants, fetchPosts]);

  // 네비게이션 핸들러
  const handleRes = () => navigate('/restaurants');
  const handlePost = () => navigate('/posts');
  const handleResDetail = (id: number) => navigate(`/restaurants/${id}`);
  const handlePostDetail = (id: number) => navigate(`/posts/${id}`);

  // 모달 열기/닫기 함수
  const openUserInfoModal = useCallback(() => setIsUserInfoModalOpen(true), []);
  const closeUserInfoModal = useCallback(() => setIsUserInfoModalOpen(false), []);

  // location.state.showFilterModal에 따라 모달 자동 열기
  useEffect(() => {
    if (location.state?.showFilterModal) {
      openUserInfoModal();
      // 상태 초기화
      const newState = { ...location.state };
      delete newState.showFilterModal;
      window.history.replaceState(newState, document.title);
    }
  }, [location.state, openUserInfoModal]);

  return (
    <>
      {/* 유저 정보 입력 모달 */}
      <AddinfoModal
        isOpen={isUserInfoModalOpen}
        onClose={closeUserInfoModal}
      />

      {/* 메인 컨텐츠 */}
      <div className="p-3 flex-1">
        {/* 추천 매장 섹션 */}
        <section className="p-12 border-b border-gray-300">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">
                  회원님을 위한 맞춤 추천
                </h2>
                <p className="text-gray-500 mt-1 text-lg">
                  회원님의 취향에 맞는 맛집을 추천해드려요
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-10 flex-wrap">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  item={restaurant}
                  onClick={() => handleResDetail(restaurant.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 추천 게시글 섹션 */}
        <section>
          <div className="flex justify-between m-4 mb-2">
            <p className="font-bold text-2xl text-gray-500 ml-2">
              고객님이 좋아할 게시글
            </p>
            <TextBtn
              fontSize="text-xl"
              text="게시글 더 보기 ->"
              onClick={handlePost}
            />
          </div>
          <div className="flex justify-center gap-10 flex-wrap">
            {dummy.map((item) => (
              <RestaurantCard
                key={item.id}
                item={item}
                onClick={() => handlePostDetail(item.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
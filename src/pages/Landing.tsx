import axios from 'axios';
import loc from '@/assets/images/location.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import AddinfoModal from '../components/Modal/AddInfoModal';
import content from '@/assets/images/content.png';

// 레스토랑 데이터 인터페이스
interface RestaurantItem {
  id: number;
  name: string;
  address: string;
  categoryName: string;
  restaurantTags: string[];
  imageUrl: string;
}

// 게시글 데이터 인터페이스
interface PostItem {
  id: number;
  name: string;
  content: string;
  categoryName: string;
  restaurantTags: string[];
  imageUrl: string;
}

const dummy: PostItem[] = [
  {
    id: 1,
    name: '도쿄시장',
    content: '연어맛집',
    categoryName: '이자카야',
    restaurantTags: ['가성비', '서민적인'],
    imageUrl:
      'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqmuhN9M4zJ0xd1RV3SFornU57tQeew43EU3OQbcyso3gAzC3udD41aAPfYawJBiF6O11_NK-3TGkSIMjPzFNXgGGHh8ioG7CxJBrOYciRPYE9ApVdSw2FCYj1lDdP-ZjjTgePF3g=w408-h306-k-no',
  },
  {
    id: 2,
    name: '도쿄시장',
    content: '연어맛집 진짜 최고 맛집',
    categoryName: '이자카야',
    restaurantTags: ['가성비', '서민적인'],
    imageUrl:
      'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqmuhN9M4zJ0xd1RV3SFornU57tQeew43EU3OQbcyso3gAzC3udD41aAPfYawJBiF6O11_NK-3TGkSIMjPzFNXgGGHh8ioG7CxJBrOYciRPYE9ApVdSw2FCYj1lDdP-ZjjTgePF3g=w408-h306-k-no',
  },
  {
    id: 3,
    name: '도쿄시장',
    content: '연어맛집',
    categoryName: '이자카야',
    restaurantTags: ['가성비', '서민적인'],
    imageUrl:
      'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqmuhN9M4zJ0xd1RV3SFornU57tQeew43EU3OQbcyso3gAzC3udD41aAPfYawJBiF6O11_NK-3TGkSIMjPzFNXgGGHh8ioG7CxJBrOYciRPYE9ApVdSw2FCYj1lDdP-ZjjTgePF3g=w408-h306-k-no',
  },
  {
    id: 4,
    name: '도쿄시장',
    content: '연어맛집',
    categoryName: '이자카야',
    restaurantTags: ['가성비', '서민적인'],
    imageUrl:
      'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqmuhN9M4zJ0xd1RV3SFornU57tQeew43EU3OQbcyso3gAzC3udD41aAPfYawJBiF6O11_NK-3TGkSIMjPzFNXgGGHh8ioG7CxJBrOYciRPYE9ApVdSw2FCYj1lDdP-ZjjTgePF3g=w408-h306-k-no',
  },
];

// 레스토랑 카드 컴포넌트
function RestaurantCard({
  item,
  onClick,
}: {
  item: RestaurantItem;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-[250px] h-[400px] border border-gray-300 rounded-2xl cursor-pointer flex flex-col shadow-lg overflow-hidden"
    >
      {/* 이미지 컨테이너 */}
      <div className="w-full h-[250px] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col px-4 py-3 flex-grow justify-between">
        {/* 이름 + 카테고리 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold truncate">{item.name}</span>
            {item.categoryName && (
              <span className="text-sm bg-main text-white px-2 py-0.5 rounded-full">
                {item.categoryName}
              </span>
            )}
          </div>

          {/* 주소 */}
          <div className="flex items-start text-medium text-gray-600 mt-1 gap-1">
            <img
              src={loc}
              alt="location icon"
              className="w-4 h-4 mr-1"
            />
            <span className="line-clamp-2">{item.address}</span>
          </div>
        </div>

        {/* 태그 */}
        {item.restaurantTags.length > 0 && (
          <div className="mt-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 w-max">
              {item.restaurantTags.map((tag, index) => (
                <span
                  key={index}
                  className="whitespace-nowrap bg-gray-200 text-primary text-sm px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 포스트 카드 컴포넌트
function PostCard({ item, onClick }: { item: PostItem; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="w-[250px] h-[400px] border border-gray-300 rounded-2xl cursor-pointer flex flex-col shadow-lg overflow-hidden"
    >
      {/* 이미지 컨테이너 */}
      <div className="w-full h-[250px] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col px-4 py-3 flex-grow justify-between">
        {/* 이름 + 카테고리 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold truncate">{item.name}</span>
            {item.categoryName && (
              <span className="text-sm bg-main text-white px-2 py-0.5 rounded-full">
                {item.categoryName}
              </span>
            )}
          </div>

          {/* 내용 */}
          <div className="flex items-start text-medium text-gray-600 mt-1 gap-1">
            <img
              src={content}
              alt="location icon"
              className="w-4 h-4 mr-1"
            />
            <span className="line-clamp-2">{item.content}</span>
          </div>
        </div>

        {/* 태그 */}
        {item.restaurantTags.length > 0 && (
          <div className="mt-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 w-max">
              {item.restaurantTags.map((tag, index) => (
                <span
                  key={index}
                  className="whitespace-nowrap bg-gray-200 text-primary text-sm px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Landing() {
  // 상태 정의
  //const [posts, setPosts] = useState<PostItem[]>([]); // 게시글 목록
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]); // 레스토랑 목록
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false); // 유저 정보 모달 열림 상태

  const navigate = useNavigate();
  const location = useLocation();

  // 게시글 데이터 가져오기
  // const fetchPosts = useCallback(async () => {
  //   try {
  //     const res = await axios.get('http://localhost:8080/api/boards/main', {
  //       headers: { Accept: 'application/json' },
  //       withCredentials: true,
  //     });

  //     const postsData = res.data.content;
  //     if (Array.isArray(postsData)) {
  //       setPosts(postsData);
  //     } else {
  //       setPosts([]);
  //     }
  //   } catch (error) {
  //     console.error('게시글 데이터 가져오기 실패:', error);
  //     setPosts([]);
  //   }
  // }, []);

  // 레스토랑 데이터 가져오기
  const fetchRestaurants = useCallback(async () => {
    try {
      const apiUrl = 'http://localhost:8080';
      const res = await axios.get(`${apiUrl}/api/restaurants/all`, {
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
    //fetchPosts();
  }, [fetchRestaurants]);

  // 네비게이션 핸들러
  const handleResDetail = (id: number) => navigate(`/restaurants/${id}`);
  // const handlePostDetail = (id: number) => navigate(`/posts/${id}`);

  // 모달 열기/닫기 함수
  const openUserInfoModal = useCallback(() => setIsUserInfoModalOpen(true), []);
  const closeUserInfoModal = useCallback(
    () => setIsUserInfoModalOpen(false),
    []
  );

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
      <AddinfoModal isOpen={isUserInfoModalOpen} onClose={closeUserInfoModal} />

      {/* 메인 컨텐츠 */}
      <div className="p-3 flex-1">
        {/* 추천 매장 섹션 */}
        <section className="p-8 border-b border-gray-300">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">
                  회원님을 위한 맛집 추천
                </h2>
                <p className="text-gray-500 mt-1 text-lg">
                  회원님의 취향에 맞는 맛집을 추천해드려요
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-10 flex-wrap:no-wrap">
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
        <section className="p-8 border-gray-300">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">
                  회원님을 위한 게시글 추천
                </h2>
                <p className="text-gray-500 mt-1 text-lg">
                  회원님의 취향에 맞는 게시글을 추천해드려요
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-10 flex-wrap:no-wrap">
              {dummy.map((item) => (
                <PostCard
                  key={item.id}
                  item={item}
                  onClick={() => handleResDetail(item.id)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

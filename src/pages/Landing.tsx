import { Suspense, lazy } from 'react';
import loc from '@/assets/images/location.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
const AddinfoModal = lazy(() => import('../components/Modal/AddInfoModal'));
import content from '@/assets/images/content.png';
import useAuth from '../hooks/useAuth';
import api from '@/lib/api';

// 레스토랑 데이터 인터페이스
interface RestaurantItem {
  id: number
  name: string
  address: string
  categoryName: string
  restaurantTags: string[]
  imageUrl: string
}

// 게시글 데이터 인터페이스
interface PostItem {
  id: number;
  restaurantName: string;
  restaurantAddress: string;
  content: string;
  restaurantCategoryName: string;
  memberNickname: string;
  memberProfileImage: string;
  //tagNames: string[];
  imageUrl: string;
}

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
              width={24}
              height={24}
              src={loc}
              alt="location icon"
              className="w-4 h-4 mr-1"
            />
            <span className="line-clamp-2">{item.address}</span>
          </div>
        </div>

        {/* 태그 */}
        {item.restaurantTags && item.restaurantTags.length > 0 && ( // item.restaurantTags가 존재하고 길이가 0보다 큰지 확인
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
          alt={item.restaurantName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col px-4 py-3 flex-grow justify-between">
        {/* 이름 + 카테고리 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold truncate">{item.restaurantName}</span>
            {item.restaurantCategoryName && (
              <span className="text-sm bg-main text-white px-2 py-0.5 rounded-full">
                {item.restaurantCategoryName}
              </span>
            )}
          </div>

          {/* 내용 */}
          <div className="flex items-start text-medium text-gray-600 mt-1 gap-1">
            <img
              width={24}
              height={24}
              src={content}
              alt="location icon"
              className="w-4 h-4 mr-1"
            />
            <span className="line-clamp-2">{item.content}</span>
          </div>
        </div>

        {/* 태그 */}
        {/* {item.restaurantCategoryName.length > 0 && (
          <div className="mt-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 w-max">
              {item.tagNames.map((tag, index) => (
                <span
                  key={index}
                  className="whitespace-nowrap bg-gray-200 text-primary text-sm px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default function Landing() {
  // 상태 정의
  const [posts, setPosts] = useState<PostItem[]>([]); // 게시글 목록
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]); // 레스토랑 목록
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAddInfoModalOpen, setIsAddInfoModalOpen] = useState(false);

  const redirectUrl = location.state?.redirectUrl || '/';

  //게시글 데이터 가져오기
  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get(`/api/boards/list?page=0&size=4`);

      const postsData = res.data.boardList;
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
      const res = await api.get(`/api/restaurants/all`);

      const restaurantsData = res.data.content
      if (Array.isArray(restaurantsData)) {
        setRestaurants(restaurantsData)
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error("레스토랑 데이터 가져오기 실패:", error)
      setRestaurants([])
    }
  }, [])

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchRestaurants();
    fetchPosts();
  }, [fetchRestaurants, fetchPosts]);

  // 네비게이션 핸들러
  const handleResDetail = (id: number) => navigate(`/restaurants/${id}`);
  const handlePostDetail = (id: number) => navigate(`/posts/${id}`);

  // 모달 열기/닫기 함수
  useEffect(() => {
    if (isAuthenticated && user?.isNewUser) {
      setIsAddInfoModalOpen(true);
    } else {
      setIsAddInfoModalOpen(false);
    }
  }, [isAuthenticated, user?.isNewUser, isAddInfoModalOpen]);
  
  const handleCloseAddInfoModal = useCallback(() => {
    setIsAddInfoModalOpen(false);
    window.location.href = redirectUrl;
    if (user?.id) {
      localStorage.setItem(`hasCompletedAdditionalInfo_${user.id}`, 'true');
      const updatedUser = { ...user, isNewUser: false };
      login(updatedUser);
    }
  }, [user, login]);

  return (
    <>
      {/* 유저 정보 입력 모달 */}
      {isAddInfoModalOpen && (
        <Suspense fallback={<div>로딩중...</div>}>
          <AddinfoModal isOpen={isAddInfoModalOpen} onClose={handleCloseAddInfoModal} />
        </Suspense>
      )}
      

      {/* 메인 컨텐츠 */}
      <div className="p-3 flex flex-1 flex-col items-center">
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
            <div className="flex justify-center gap-10 flex-nowrap">
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
                  <h2 className="text-3xl font-bold tracking-tighter">회원님을 위한 게시글 추천</h2>
                  <p className="text-gray-500 mt-1 text-lg">회원님의 취향에 맞는 게시글을 추천해드려요</p>
                </div>
              </div>
              <div className="flex justify-center gap-10 flex-wrap:no-wrap">
                {dummy.map((item) => (
                    <PostCard key={item.id} item={item} onClick={() => handleResDetail(item.id)} />
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-10 flex-nowrap">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  item={post}
                  onClick={() => handlePostDetail(post.id)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

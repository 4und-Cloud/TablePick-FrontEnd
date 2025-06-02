import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet"
import type {LatLngExpression} from "leaflet"
import "leaflet/dist/leaflet.css"
import useModal from "../hooks/useModal"
import ReservationModal from "../components/Modal/ReservationModal"
import {useEffect, useState} from "react"
import { useParams, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import LoginModal from "../components/Modal/LoginModal"
import api from "../lib/api"
import { NotificationTypes } from "../types/notification"

type RestaurantData = {
  id: number;
  name: string;
  address: string;
  restaurantPhoneNumber: string;
  restaurantCategory: { id: number; name: string };
  restaurantImage: { imageUrl: string };
  restaurantOperatingHours: {
    dayOfWeek: string;
    openTime: string | null;
    closeTime: string | null;
    holiday: boolean;
  }[];
  restaurantTags: string[];
  menus: { name: string; price: number }[];
};

type RestaurantReviewPost = {
  boardId: number;
  imageUrl: string;
};

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<RestaurantData | null>(null);
  const {
    isOpen: isReservationOpen,
    openModal: openReservationModal,
    closeModal: closeReservationModal,
  } = useModal({ initialState: false });
  const {
    isOpen: isLoginOpen,
    openModal: openLoginModal,
    closeModal: closeLoginModal,
  } = useModal({ initialState: false });
  const [reviewPosts, setReviewPosts] = useState<RestaurantReviewPost[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/api/restaurants/${id}`);
        const data = await res.data;
        setData(data);
      } catch (err) {
        console.error('식당 데이터를 불러오는데 실패했습니다.', err);
      }
    };

    if (id) {
      fetchRestaurant();
      fetchReviewPosts();
    }
  }, [id]);

  const fetchReviewPosts = async () => {
    try {
      const res = await api.get(`/api/boards/restaurant/${id}`);
      const json: RestaurantReviewPost[] = await res.data;
      setReviewPosts(json);
    } catch (error) {
      console.error('식당 게시글 불러오기 실패');
    }
  };

  const sendReservationNotification = async () => {
    if (!data) return;

    try {
      api.post(`/api/notifications`, {
        notificationType: 'RESERVATION_COMPLETED' as NotificationTypes,
        title: '식당 예약 완료',
        message: `${data.name} 예약이 성공적으로 완료되었습니다.`,
        restaurantId: data.id,
      });
    } catch (error) {
      console.error('알림 전송 실패:', error);
    }
  };

  const handleReservationClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      openReservationModal();
    }
  };

  if (!data) return <div className="mt-20 text-center">로딩 중...</div>;

  const restaurantLocation: LatLngExpression = [37.51, 127.03]; // 예시 좌표

  return (
    <div className="pt-4 p-4 min-h-screen flex flex-col">
      {/* 이미지 + 정보 */}
      <div className="flex flex-row gap-2 mb-8 flex-1">
        {/* 이미지 */}
        <div className="flex flex-wrap gap-4 w-full">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-[calc(33.333%-1rem)] aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
            >
              <img
                src={data.restaurantImage.imageUrl}
                alt={`식당 이미지 ${i + 1}`}
                className="object-cover w-full h-full rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>

        {/* 정보 */}
        <div className="space-y-4 w-1/3 ml-2 items-center flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {data.name}
            </h2>
            <p className="text-sm text-gray-600">{data.address}</p>
            <p className="text-sm text-gray-600">
              전화번호: {data.restaurantPhoneNumber}
            </p>
            <p className="text-sm text-gray-600">
              카테고리: {data.restaurantCategory.name}
            </p>
            <p className="text-sm text-gray-600">
              {data.restaurantTags && Array.isArray(data.restaurantTags) // restaurantTags가 존재하고 배열인지 확인
                ? data.restaurantTags.slice(0, 5).join(', ')
                : '태그 정보 없음'}{' '}
              {/* 태그가 없을 경우 대체 텍스트 */}
            </p>
          </div>

          <button
            onClick={handleReservationClick}
            className="w-full py-3 bg-main text-white rounded-lg hover:bg-opacity-90 transition"
          >
            예약하기
          </button>
        </div>
      </div>

      {/* 지도 */}
      <div className="bg-gray-200 w-full h-96 rounded-lg mb-6 z-0">
        <MapContainer
          center={restaurantLocation}
          zoom={18}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={restaurantLocation}>
            <Popup>{data.name} 위치입니다.</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* 주소 */}
      <div className="bg-gray-200 p-4 rounded-lg text-gray-800 mb-6">
        {data.address}
      </div>

      {/* 메뉴 + 리뷰 */}
      <div className="flex items-center justify-center flex-row gap-6">
        {/* 메뉴 */}
        <div className="w-1/2 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">메뉴</h3>
          {data.menus.map((menu, i) => (
            <p key={i} className="text-sm text-gray-600">
              {menu.name} ------------------------ {menu.price}₩
            </p>
          ))}
        </div>

        {/* 방문자 평가 (임시) */}
        <div className="w-full mb-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              방문자 평가
            </h3>
            <button
              className="text-lg font-semibold text-main mb-4"
              onClick={() => navigate(`/posts?restaurantId=${id}`)}
            >
              게시글 보러가기
            </button>
          </div>

          <div className="flex gap-4 justify-between">
            {reviewPosts.slice(0, 3).map((post) => (
              <div
                key={post.boardId}
                className="bg-gray-200 w-1/3 h-40 rounded-lg flex items-center justify-center overflow-hidden"
              >
                <img
                  src={post.imageUrl}
                  className="object-cover w-full h-full rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 예약 모달 */}
      {isReservationOpen && (
        <ReservationModal
          closeModal={closeReservationModal}
          restaurantId={Number(id)}
        />
      )}
      {isLoginOpen && (
        <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} />
      )}
    </div>
  );
}

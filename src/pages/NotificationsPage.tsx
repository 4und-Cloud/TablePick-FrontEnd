import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { getMemberNotifications } from '../lib/firebase';

/**
 * 알림 데이터 인터페이스
 * @property {number} id - 알림 고유 ID
 * @property {string} title - 알림 제목
 * @property {string} body - 알림 본문 (플레이스홀더 포함)
 * @property {string} status - 알림 상태 (SENT, PENDING 등)
 * @property {string} sentAt - 알림 발송 시간
 * @property {string} type - 알림 유형 (RESERVATION_3HOURS_BEFORE 등)
 * @property {string} [restaurantName] - 식당 이름 (플레이스홀더 {restaurantName}에 사용)
 * @property {string} [scheduledAt] - 예약 시간
 * @property {number} [memberId] - 회원 ID
 * @property {number} [reservationId] - 예약 ID
 */
interface Notification {
  id: number;
  title: string;
  body: string;
  status: string;
  sentAt: string;
  type: string;
  restaurantName?: string;
  scheduledAt?: string;
  memberId?: number;
  reservationId?: number;
}

// 알림 타입 정의
const NOTIFICATION_TYPES = {
  RESERVATION_1DAY_BEFORE: {
    title: '예약 1일 전 알림',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  RESERVATION_3HOURS_BEFORE: {
    title: '예약 3시간 전 알림',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
  },
  RESERVATION_1HOUR_BEFORE: {
    title: '예약 1시간 전 알림',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
  RESERVATION_COMPLETED: {
    title: '예약 완료 알림',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  REGISTER_COMPLETED: {
    title: '회원가입 완료',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
  },
  RESERVATION_3HOURS_AFTER: {
    title: '예약 3시간 후 알림',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
  },
} as const;

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    setDebugInfo(
      `인증 상태: ${isAuthenticated ? '로그인됨' : '로그인 안됨'}, 사용자 ID: ${user?.id || '없음'}`
    );

    async function fetchNotifications() {
      // 로컬 스토리지에서 사용자 정보 직접 확인 (디버깅용)
      const localUser = localStorage.getItem('infoUser');

      let userId = user?.id;

      // 로컬 스토리지에서 사용자 ID를 가져오는 대체 방법
      if (!userId && localUser) {
        try {
          const parsedUser = JSON.parse(localUser);
          userId = parsedUser.id;
        } catch (err) {
          console.error('로컬 스토리지 사용자 정보 파싱 오류:', err);
        }
      }

      if (!userId) {
        setError('로그인이 필요합니다');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // SENT 상태의 알림만 가져오기
        const data = await getMemberNotifications(userId, 'SENT');
        setNotifications(data);
        setError(null);
      } catch (err) {
        console.error('알림 목록 조회 오류:', err);
        setError('알림을 불러오는 중 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    }

    // 인증 상태가 확인되면 알림 데이터 가져오기
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      // 로컬 스토리지에서 사용자 정보 확인
      const localUser = localStorage.getItem('infoUser');
      if (localUser) {
        console.log(
          '로컬 스토리지에 사용자 정보가 있지만 인증 상태가 false입니다.'
        );
        fetchNotifications(); // 로컬 스토리지 정보로 시도
      } else {
        setError('로그인이 필요합니다');
        setLoading(false);
      }
    }
  }, [isAuthenticated, user]);

  // 알림 타입에 따른 아이콘 및 색상 설정
  const getNotificationStyle = (type: string) => {
    const notificationType =
      NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES];

    // 기본 스타일 설정
    const baseStyle = {
      icon: '',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      label: notificationType?.title || '일반 알림',
    };

    return notificationType
      ? {
          ...baseStyle,
          bgColor: notificationType.bgColor,
          textColor: notificationType.textColor,
          label: notificationType.title,
        }
      : baseStyle;
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', {
        locale: ko,
      });
    } catch (e) {
      return dateString;
    }
  };

  /**
   * 알림 메시지의 플레이스홀더를 실제 값으로 변환
   *
   * 사용 가능한 플레이스홀더:
   * - {restaurantName}: 식당 이름
   * - {date}: 알림 발송 시간 (yyyy년 MM월 dd일 HH:mm 형식)
   * - {scheduledTime}: 예약 시간 (yyyy년 MM월 dd일 HH:mm 형식)
   *
   * 새로운 플레이스홀더 추가 시 placeholders 객체에 추가하면 됩니다.
   *
   * @param message - 플레이스홀더가 포함된 원본 메시지
   * @param notification - 알림 데이터 객체
   * @returns 플레이스홀더가 실제 값으로 대체된 메시지
   */
  const processMessage = (message: string, notification: Notification) => {
    if (!message) return '';

    let processedMessage = message;

    // 플레이스홀더와 대체할 값 매핑
    const placeholders = {
      // 식당 관련
      '{restaurantName}': notification.restaurantName,
      '{restaurant}': notification.restaurantName,

      // 시간 관련
      '{date}': notification.sentAt ? formatDate(notification.sentAt) : '',
      '{scheduledTime}': notification.scheduledAt
        ? formatDate(notification.scheduledAt)
        : '',

      // 추가 플레이스홀더는 여기에 추가
    };

    // 모든 플레이스홀더 처리
    Object.entries(placeholders).forEach(([placeholder, value]) => {
      if (value) {
        processedMessage = processedMessage.replace(
          new RegExp(placeholder, 'g'),
          value
        );
      }
    });

    return processedMessage;
  };

  // 식당 목록 추출
  const restaurants = Array.from(
    new Set(notifications.map((n) => n.restaurantName).filter(Boolean))
  ).sort();

  // 필터링된 알림 목록
  const filteredNotifications = notifications.filter((notification) => {
    if (selectedRestaurant === 'all') return true;
    return notification.restaurantName === selectedRestaurant;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        {/* 디버깅 정보 표시 */}
        <div className="text-gray-500 text-sm mb-4">{debugInfo}</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-main text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[80px]">
      <h1 className="text-2xl font-bold text-main mb-6">내 알림 목록</h1>

      {/* 식당 필터 */}
      <div className="mb-6">
        <label
          htmlFor="restaurant-filter"
          className="block text-sm font-medium text-gray-700 mb-2"
        ></label>
        <select
          id="restaurant-filter"
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
          className="block w-full max-w-xs px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main"
        >
          <option value="all">전체 알림</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant} value={restaurant}>
              {restaurant}
            </option>
          ))}
        </select>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {selectedRestaurant === 'all'
              ? '알림이 없습니다.'
              : '선택한 식당의 알림이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...filteredNotifications]
            .sort(
              (a, b) =>
                new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
            )
            .map((notification) => {
              const style = getNotificationStyle(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`p-4 ${style.bgColor} rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{style.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-bold ${style.textColor}`}>
                            {notification.title || style.label}
                          </h3>
                          {notification.restaurantName &&
                            notification.restaurantName !==
                              '{restaurantName}' && (
                              <p className="text-gray-700 mt-1 font-medium">
                                <span className="inline-block bg-main text-white px-2 py-0.5 rounded text-xs mr-2">
                                  식당
                                </span>
                                {notification.restaurantName}
                              </p>
                            )}
                          <p className="text-gray-700 mt-1">
                            {processMessage(notification.body, notification)}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(notification.sentAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

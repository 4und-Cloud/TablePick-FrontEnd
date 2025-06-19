import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/features/auth/hook/useAuth';
import {
  initializeFirebaseAppAndMessaging,
  getFCMToken,
  getSavedFCMToken,
  saveFCMToken,
} from '@/features/notification/lib/firebase';
import defaultProfile from '@/@shared/images/user.png';
import api from '@/@shared/api/api';
import { useFcmtokenUpdate } from '@/features/auth/hook/mutations/useFcmtokenUpdate';
import { fetchNotificationSchedule } from '@/features/notification/api/fetchNotification';

export default function OauthSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginProcessed, setIsLoginProcessed] = useState(false);
  const notificationScheduledRef = useRef(false); // 알림 스케줄링 플래그 추가

  const { mutateAsync: updateFcmtoken } = useFcmtokenUpdate();

  useEffect(() => {
    let isMounted = true;

    async function fetchUserInfoAndHandleFCM() {
      if (!isMounted || isLoginProcessed) return;

      try {
        setLoading(true);

        const messagingInstance = await initializeFirebaseAppAndMessaging();

        if (!messagingInstance) {
          console.log('firebase 초기화 실패');
        }

        const [userResponse, fcmToken] = await Promise.all([
          api.get(`/api/members`),
          (async () => {
            if (!messagingInstance) return null;
            try {
              let token = getSavedFCMToken();
              if (!token) {
                token = await getFCMToken(messagingInstance);
              }
              return token;
            } catch (fcmError) {
              console.error('FCM 토큰 가져오기 실패:', fcmError);
              return null;
            }
          })(),
        ]);

        const userData = userResponse.data;

        if (!userData || !userData.email || !userData.id) {
          throw new Error('잘못된 사용자 데이터');
        }

        // FCM 토큰 서버 저장
        if (fcmToken && userData.id) {
          try {
            await saveFCMToken(userData.id, fcmToken, updateFcmtoken);
          } catch (fcmError) {
            console.error('FCM 토큰 서버 저장 실패:', fcmError);
          }
        } else {
          console.warn('FCM 토큰 또는 사용자 ID가 없음');
        }

        // 회원가입 알림 스케줄링
        const isUserRecentlyCreated = userData.createAt
          ? isRecentlyCreated(userData.createAt)
          : false;
        if (isUserRecentlyCreated && userData.id && !notificationScheduledRef.current) {
          try {
            await fetchNotificationSchedule('REGISTER_COMPLETED', userData.id);
            console.log('회원가입 알림 스케줄링 성공:', userData.id);
            notificationScheduledRef.current = true; // 알림 스케줄링 완료
          } catch (notificationError) {
            console.error('회원가입 알림 스케줄링 실패:', notificationError);
          }
        }

        let memberTagsForAuthContext: number[] = [];
        if (Array.isArray(userData.memberTagIds)) {
          memberTagsForAuthContext = userData.memberTagIds
            .map((tagId: any) => Number(tagId))
            .filter((id: number) => !isNaN(id));
        } else {
          console.warn('서버 응답에 memberTagIds 필드가 없거나 배열이 아님:', userData.memberTagIds);
          memberTagsForAuthContext = [];
        }

        const hasCompletedAdditionalInfo = sessionStorage.getItem(`hasCompletedAdditionalInfo_${userData.id}`);
        const shouldShowAdditionalInfoModal = isUserRecentlyCreated && !hasCompletedAdditionalInfo;

        const normalizedUser = {
          id: userData.id,
          email: userData.email,
          nickname: userData.nickname || userData.name || '',
          profileImage: userData.profileImage || defaultProfile,
          gender: userData.gender || '',
          birthdate: userData.birthdate || '',
          phoneNumber: userData.phoneNumber || '',
          memberTags: memberTagsForAuthContext,
          createAt: userData.createAt || '',
          isNewUser: shouldShowAdditionalInfoModal,
        };

        if (!isLoginProcessed) {
          login(normalizedUser);
          sessionStorage.setItem('userInfo', JSON.stringify(normalizedUser));

          const params = new URLSearchParams(location.search);
          const redirectUrl = params.get('redirect') || '/';

          if (!shouldShowAdditionalInfoModal) {
            alert('로그인 성공');
            navigate(redirectUrl);
          } else {
            navigate('/', { state: { redirectUrl, showFilterModal: true } });
          }

          setIsLoginProcessed(true);
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        setError('로그인 처리 중 오류가 발생했습니다.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUserInfoAndHandleFCM();

    return () => {
      isMounted = false;
    };
  }, [login, navigate, isLoginProcessed]); // 의존성에 isLoginProcessed 추가

  const isRecentlyCreated = (createdAtStr: string): boolean => {
    const createdAt = new Date(createdAtStr);
    const now = new Date();
    const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    return diffInMinutes < 1;
  };

  if (loading) {
    return <div className="mt-[80px] text-center">로그인 중입니다...</div>;
  }

  if (error) {
    return (
      <div className="mt-[80px] text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-main text-white rounded-md"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return <div className="mt-[80px] text-center">로그인 처리 중입니다...</div>;
}
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  getFCMToken,
  getSavedFCMToken,
  saveFCMToken,
} from '../../lib/firebase';
import defaultProfile from '@/assets/images/user.png';

export default function OauthSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginProcessed, setIsLoginProcessed] = useState(false); // 로그인 처리 플래그

  useEffect(() => {
    let isMounted = true; // 마운트 상태 체크

    async function fetchUserInfoAndHandleFCM() {
      if (!isMounted) return; // 컴포넌트가 언마운트된 경우 중단

      try {
        setLoading(true);

        // FCM 토큰 처리와 사용자 정보 요청을 병렬로 실행
        const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL;
        const [userResponse, fcmToken] = await Promise.all([
          axios.get(`${apiUrl}/api/members`, {
            headers: {
              Accept: 'application/json',
            },
            withCredentials: true,
          }),
          (async () => {
            try {
              let token = getSavedFCMToken();
              if (!token) {
                token = await getFCMToken();
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

        // FCM 토큰 서버 저장 (에러 무시)
        if (fcmToken && userData.id) {
          try {
            await saveFCMToken(userData.id, fcmToken);
          } catch (fcmError) {
            console.error('FCM 토큰 서버 저장 실패:', fcmError);
          }
        } else {
          console.warn('FCM 토큰 또는 사용자 ID가 없음');
        }

        // 사용자 태그 처리
        let memberTagsForAuthContext: number[] = [];
        if (Array.isArray(userData.memberTagIds)) {
          memberTagsForAuthContext = userData.memberTagIds
            .map((tagId: any) => Number(tagId))
            .filter((id: number) => !isNaN(id));
        } else {
          console.warn(
            '서버 응답에 memberTagIds 필드가 없거나 배열이 아닙니다:',
            userData.memberTagIds
          );
          memberTagsForAuthContext = [];
        }

        const isUserRecentlyCreated = userData.createAt
          ? isRecentlyCreated(userData.createAt)
          : false;

        const hasCompletedAdditionalnfo = localStorage.getItem(
          `hasCompletedAdditionalInfo_${userData.id}`
        );

        const shouldShowAdditionalInfoModal =
          isUserRecentlyCreated && !hasCompletedAdditionalnfo;

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

        // 로그인 처리 (중복 방지 플래그 설정)
        if (!isLoginProcessed) {
          login(normalizedUser);
          localStorage.setItem('userInfo', JSON.stringify(normalizedUser));

          const params = new URLSearchParams(location.search);
          const redirectUrl = params.get('redirect') || '/';

          if (!shouldShowAdditionalInfoModal) {
            alert('로그인 성공'); // 한 번만 호출
            navigate(redirectUrl);
          } else {
            navigate('/', { state: { redirectUrl, showFilterModal: true } });
          }

          setIsLoginProcessed(true); // 로그인 처리 완료 표시
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        setError('로그인 처리 중 오류가 발생했습니다.');
      } finally {
        if (isMounted) setLoading(false); // 마운트 상태 확인 후 로딩 해제
      }
    }

    fetchUserInfoAndHandleFCM();

    // 클린업
    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 마운트 상태 변경
    };
  }, [login, navigate, location.search]); 

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
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
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL;
        const response = await axios.get(`${apiUrl}/api/members`, {
          headers: {
            Accept: 'application/json',
          },
          withCredentials: true,
        });
        const userData = response.data;
        console.log('OAuth 성공 페이지 - 사용자 데이터:', userData);
        if (!userData || !userData.email || !userData.id) {
          throw new Error('잘못된 사용자 데이터');
        }

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
          // memberTagIds가 없으면 빈 배열로 초기화 (기존 로직 유지)
          memberTagsForAuthContext = [];
        }

        const isUserRecentlyCreated = userData.createAt
          ? isRecentlyCreated(userData.createAt)
          : false;

        const hasCompletedAdditionalnfo = localStorage.getItem(
          `hasCompletedAdditionalInfo_${userData.id}`
        );

        // isNewUser는 최근 생성되었고 AND 아직 추가 정보 모달을 완료하지 않은 경우
        // false, 신규 유저가 아닌 경우
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
        console.log(
          'OAuth 성공 페이지 - 정규화된 사용자 데이터:',
          normalizedUser
        );
        // 로그인 처리
        login(normalizedUser);
        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem('userInfo', JSON.stringify(normalizedUser));
        console.log('OAuth 성공 페이지 - 로컬 스토리지에 사용자 정보 저장됨');
        // FCM 토큰 처리는 로그인 성공 후에 비동기적으로 처리
        setTimeout(async () => {
          try {
            // FCM 토큰 처리
            let fcmToken = getSavedFCMToken();
            if (!fcmToken) {
              fcmToken = await getFCMToken();
            }
            if (fcmToken && normalizedUser.id) {
              await saveFCMToken(normalizedUser.id, fcmToken);
            }
          } catch (fcmError) {
            console.error('FCM 토큰 처리 중 오류:', fcmError);
            // FCM 토큰 오류는 로그인 프로세스를 중단시키지 않음
          }
        }, 1000);

        if (!shouldShowAdditionalInfoModal) {
          alert('로그인 성공');
        }

        navigate('/', { state: { showFilterModal: true } });
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        setError('로그인 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, [login, navigate]);

  // 최근 생성된 계정인지 확인하는 함수 (예: 1분 이내)
  const isRecentlyCreated = (createdAtStr: string): boolean => {
    const createdAt = new Date(createdAtStr);
    const now = new Date();
    const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    return diffInMinutes < 1; // 1분 이내에 생성된 계정
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

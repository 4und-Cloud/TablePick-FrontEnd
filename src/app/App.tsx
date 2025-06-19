import '@/app/App.css'
import PageRouter from '@/app/pageRouter'
import AuthHeader from '../@shared/components/Header/AuthHeader'
import UnAuthHeader from '../@shared/components/Header/UnAuthHeader'
import useAuth from '@/features/auth/hook/useAuth'
import { initializeFirebaseAppAndMessaging, getFCMToken, saveFCMToken, setupNotificationListener } from '@/features/notification/lib/firebase'
import { useEffect, useState } from 'react'
import { useFcmtokenUpdate } from '@/features/auth/hook/mutations/useFcmtokenUpdate';

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const { mutateAsync: updateFcmtoken } = useFcmtokenUpdate();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const setupFCM = async () => {
    console.log('FCM 설정 시작...');

    try {
      const messaging = await initializeFirebaseAppAndMessaging();
      if (!messaging) {
        console.error('FCM 초기화 실패: Messaging 인스턴스 생성 실패');
        return;
      }

      console.log('FCM 초기화 성공');

      // FCM 토큰 가져오기
      const token = await getFCMToken(messaging);
      if (!token) {
        console.error('FCM 토큰 가져오기 실패');
        return;
      }

      setFcmToken(token);
      console.log('FCM 토큰 생성 완료:', token);

      // sessionStorage에서 userInfo.id 확인
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
      const memberId = userInfo?.id || user?.id;

      if (memberId) {
        await saveFCMToken(memberId, token, updateFcmtoken);
        console.log('FCM 토큰 저장 완료:', { memberId });
      } else {
        console.warn('사용자 ID 없음: 토큰 저장 건너뜀. 로그인 후 재시도 예정.');
      }

      // 알림 리스너 설정
      setupNotificationListener(messaging, (payload) => {
        console.log('App.tsx에서 포그라운드 메시지 수신:', payload);
      });
    } catch (error) {
      console.error('FCM 설정 오류:', error);
    }
  };

  useEffect(() => {
    setupFCM();
  }, []); // user.id 의존성 제거, 앱 시작 시 1회 실행

  // user.id 또는 sessionStorage.userInfo.id 변경 시 토큰 저장 재시도
  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    const memberId = userInfo?.id || user?.id;

    if (fcmToken && memberId) {
      saveFCMToken(memberId, fcmToken, updateFcmtoken)
        .then(() => console.log('FCM 토큰 저장 완료 (재시도):', { memberId }))
        .catch((error) => console.error('FCM 토큰 저장 실패 (재시도):', error));
    }
  }, [user?.id, fcmToken, updateFcmtoken]);

  
  return (
    <div className="relative w-full min-h-screen flex justify-center bg-white">
      {/* 실제 콘텐츠 영역 */}
      <div className="relative min-h-screen w-full bg-white">
        {isAuthenticated ? <AuthHeader /> : <UnAuthHeader />}
        <PageRouter />
      </div>
    </div>
  )
}
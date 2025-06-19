import { useEffect, useState } from 'react';
import { initializeFirebaseAppAndMessaging, getFCMToken, saveFCMToken } from '@/features/notification/lib/firebase';
import { fetchFcmtokenUpdate } from '@/features/auth/api/fetchFcmtoken';
import { initializeNotificationTypeMap } from '@/features/notification/api/fetchNotification';
import { Messaging } from 'firebase/messaging';

export const useNotification = () => {
  const [fcmInitialized, setFcmInitialized] = useState(false);
  const [notificationInitialized, setNotificationInitialized] = useState(false);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // FCM 초기화
        const messagingInstance = await initializeFirebaseAppAndMessaging();
        if (!messagingInstance) {
          setError('Firebase Messaging 초기화에 실패했습니다.');
          return;
        }
        setMessaging(messagingInstance);

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setError('알림 권한이 허용되지 않았습니다.');
          return;
        }

        const token = await getFCMToken(messagingInstance);
        if (token) {
          const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
          const memberId = userInfo?.id;
          if (memberId) {
            await saveFCMToken(memberId, token, fetchFcmtokenUpdate);
            console.log('FCM 토큰 저장 성공:', memberId, token);
            setFcmInitialized(true);
          } else {
            setError('사용자 ID를 찾을 수 없습니다.');
          }
        } else {
          setError('FCM 토큰 발급에 실패했습니다.');
        }

        // 알림 타입 초기화
        await initializeNotificationTypeMap();
        console.log('알림 타입 초기화 완료');
        setNotificationInitialized(true);
      } catch (error: any) {
        console.error('알림 초기화 오류:', error);
        setError(error.message || '알림 시스템 초기화 실패');
      }
    };
    init();
  }, []);

  return { fcmInitialized, notificationInitialized, messaging, error };
};
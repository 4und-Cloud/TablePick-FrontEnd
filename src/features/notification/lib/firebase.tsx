import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
  isSupported,
} from 'firebase/messaging';

import { fetchMemberNotification } from '../api/fetchNotification';
import { fetchNotificationTypes } from '../api/fetchNotification';
import { useFcmTokenRemoveMutation } from '@/features/auth/hook/mutations/useFcmtokenRemoveMutation';
import { useFcmtokenUpdate } from '@/features/auth/hook/mutations/useFcmtokenUpdate';

// Firebase 설정 정보
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
let messaging: Messaging | null = null;

const initializeFirebase = async () => {
  if (typeof window === 'undefined') return;

  try {
    const app = initializeApp(firebaseConfig);
    
    // 서비스 워커 등록
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        });
        console.log('서비스 워커 등록 성공:', registration.scope);
        
        // FCM 지원 여부 확인
        const supported = await isSupported();
        if (!supported) {
          console.error('이 브라우저는 Firebase Cloud Messaging을 지원하지 않습니다.');
          return null;
        }

        // 서비스 워커 등록 후에 messaging 초기화
        messaging = getMessaging(app);
        return messaging;
      } catch (error) {
        console.error('서비스 워커 등록 실패:', error);
        return null;
      }
    } else {
      console.error('이 브라우저는 서비스 워커를 지원하지 않습니다.');
      return null;
    }
  } catch (error) {
    console.error('Firebase 초기화 오류:', error);
    return null;
  }
};

// Firebase 초기화 실행
initializeFirebase();

// 알림 권한 요청
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.error('브라우저가 알림을 지원하지 않습니다.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('알림 권한 허용됨');
      return true;
    } else if (permission === 'denied') {
      console.error('알림 권한 거부됨. 브라우저 설정에서 변경 필요.');
      return false;
    }
    return false;
  } catch (error) {
    console.error('알림 권한 요청 중 오류:', error);
    return false;
  }
}

// FCM 토큰 가져오기
export async function getFCMToken(): Promise<string | null> {
  if (!messaging) {
    console.error('Firebase 메시징 초기화 실패');
    return null;
  }

  try {
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.error('알림 권한 없음');
      return null;
    }

    // 기존 토큰 확인
    const savedToken = sessionStorage.getItem('fcm_token');
    if (savedToken) {
      console.log('저장된 FCM 토큰 사용:', savedToken);
      return savedToken;
    }

    // 새 토큰 요청
    const token = await getToken(messaging, {
      vapidKey:
        import.meta.env.VITE_FIREBASE_VAPID_KEY
    });

    if (token) {
      sessionStorage.setItem('fcm_token', token);
      console.log('새 FCM 토큰 발급:', `${token.substring(0, 10)}...`);
      return token;
    }
    console.error('FCM 토큰 발급 실패');
    return null;
  } catch (error) {
    console.error('FCM 토큰 발급 오류:', error);
    return null;
  }
}

// 저장된 FCM 토큰 가져오기
export function getSavedFCMToken(): string | null {
  return sessionStorage.getItem('fcm_token');
}

// FCM 토큰 서버 저장
export async function saveFCMToken(
  userId: number,
  token: string | null | undefined
): Promise<boolean> {
  const { mutateAsync: updateFcmtoken } = useFcmtokenUpdate();
  if (!token || token.trim() === '') {
    console.error('유효하지 않은 토큰:', token);
    return false;
  }

  try {
    const memberId = typeof userId === "string" ? parseInt(userId, 10) : userId;
    if (isNaN(memberId)) {
      console.error("유효하지 않은 memberId:", userId);
      return false;
    }

    await updateFcmtoken({ memberId, token });
    console.log('토큰 서버 저장 성공');
    return true;
  } catch (error) {
    console.error('토큰 서버 저장 실패:', error);
    return false;
  }
};

// FCM 토큰 삭제
export async function deleteFCMToken(userId: number): Promise<boolean> {
  const { mutateAsync: removeFcmtoken } = useFcmTokenRemoveMutation();

  try {
    const memberId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    if (isNaN(memberId)) {
      console.error('유효하지 않은 memberId:', userId);
      return false;
    }

    await removeFcmtoken({ memberId });
    sessionStorage.removeItem('fcm_token');
    console.log('FCM 토큰 삭제 성공');
    return true;
  } catch (error) {
    console.error('FCM 토큰 삭제 오류:', error);
    return false;
  }
}

// 포그라운드 알림 처리
export function setupNotificationListener(
  callback?: (payload: any) => void
): void {
  if (!messaging) {
    console.error('Firebase 메시징 초기화 실패');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('포그라운드 메시지 수신:', payload);

    if (Notification.permission === 'granted' && payload.notification) {
      const notificationTitle = payload.notification.title || '새 알림';
      const notificationOptions = {
        body: payload.notification.body || '새로운 메시지가 도착했습니다.',
        icon: '@/@shared/images/logo.png',
      };
      new Notification(notificationTitle, notificationOptions);
    }

    callback?.(payload);
  });
}

// 회원 알림 목록 조회
export async function getMemberNotifications(
  memberId: number,
  status?: string
): Promise<any[]> {
  try {
    const response = await fetchMemberNotification(memberId, status);
    
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    console.error('알림 목록 조회 실패:', response.data);
    return [];
  } catch (error) {
    console.error('알림 목록 조회 오류:', error);
    return [];
  }
}

// 알림 타입 조회
export async function getNotificationTypes(): Promise<any[]> {
  try {
    const response = await fetchNotificationTypes();
    
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    console.error('알림 타입 조회 실패:', response.data);
    return [];
  } catch (error) {
    console.error('알림 타입 조회 오류:', error);
    return [];
  }
}

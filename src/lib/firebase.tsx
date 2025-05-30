import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
} from 'firebase/messaging';

// Firebase 설정 정보
const firebaseConfig = {
  apiKey: 'AIzaSyA7Qw41MPAqVcpetusZjgMfEPYXis4q3RQ',
  authDomain: 'project-tablepick.firebaseapp.com',
  projectId: 'project-tablepick',
  storageBucket: 'project-tablepick.firebasestorage.app',
  messagingSenderId: '806487490296',
  appId: '1:806487490296:web:96a37b5c5e12464066850d',
  measurementId: 'G-7VLJ4SH0RF',
};

// Firebase 초기화
let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
  try {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);

    // 서비스 워커 등록
    if (navigator.serviceWorker) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('서비스 워커 등록 성공:', registration.scope);
        })
        .catch((error) => {
          console.error('서비스 워커 등록 실패:', error);
        });
    }
  } catch (error) {
    console.error('Firebase 초기화 오류:', error);
  }
}

// 알림 권한 요청
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.error('브라우저가 알림을 지원하지 않습니다.');
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('알림 권한 허용됨');
    return true;
  } else if (permission === 'denied') {
    console.error('알림 권한 거부됨. 브라우저 설정에서 변경 필요.');
    return false;
  }
  return false;
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

    if (!navigator.serviceWorker) {
      console.error('브라우저가 서비스 워커를 지원하지 않음');
      return null;
    }

    // 기존 토큰 확인
    const savedToken = localStorage.getItem('fcm_token');
    if (savedToken) {
      console.log('저장된 FCM 토큰 사용:', savedToken);
      return savedToken;
    }

    // 새 토큰 요청
    const token = await getToken(messaging, {
      vapidKey:
        'BJU5QrpqOX0cekAcEVGx8NKmAobnUKzEfRqQGKgNvSG61sdBht3KkQPCcB2wDfbkT5NvrYIE5ktp6wBsZOrrPTw',
    });

    if (token) {
      localStorage.setItem('fcm_token', token);
      console.log('새 FCM 토큰 발급:', token);
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
  return localStorage.getItem('fcm_token');
}

// FCM 토큰 서버 저장
export async function saveFCMToken(
  userId: number | string,
  token: string
): Promise<boolean> {
  if (!token) {
    console.error('토큰이 유효하지 않음');
    return false;
  }

  try {
    // 환경 변수로 대체 가능 (예: process.env.REACT_APP_API_URL)
    const apiUrl = 'http://localhost:8080';
    const response = await fetch(
      `${apiUrl}/api/notifications/fcm-token?memberId=${userId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        credentials: 'include',
      }
    );

    if (response.ok) {
      console.log('FCM 토큰 서버 저장 성공');
      return true;
    }
    console.error('FCM 토큰 저장 실패:', await response.text());
    return false;
  } catch (error) {
    console.error('FCM 토큰 저장 오류:', error);
    return false;
  }
}

// FCM 토큰 삭제
export async function deleteFCMToken(
  userId: number | string
): Promise<boolean> {
  try {
    localStorage.removeItem('fcm_token');
    // 환경 변수로 대체 가능
    const apiUrl = 'http://localhost:8080';
    const response = await fetch(
      `${apiUrl}/api/notifications/fcm-token?memberId=${userId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );

    if (response.ok) {
      console.log('FCM 토큰 삭제 성공');
      return true;
    }
    console.error('FCM 토큰 삭제 실패:', await response.text());
    return false;
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
        icon: '/images/logo.png',
      };
      new Notification(notificationTitle, notificationOptions);
    }

    callback?.(payload);
  });
}

// 회원 알림 목록 조회
export async function getMemberNotifications(
  memberId: number | string,
  status?: string
): Promise<any[]> {
  try {
    // 환경 변수로 대체 가능
    const apiUrl = 'http://localhost:8080';
    const url = status
      ? `${apiUrl}/api/notifications/member/${memberId}?status=${status}`
      : `${apiUrl}/api/notifications/member/${memberId}`;

    const response = await fetch(url, { credentials: 'include' });
    if (response.ok) {
      return await response.json();
    }
    console.error('알림 목록 조회 실패:', await response.text());
    return [];
  } catch (error) {
    console.error('알림 목록 조회 오류:', error);
    return [];
  }
}

// 알림 타입 조회
export async function getNotificationTypes(): Promise<any[]> {
  try {
    // 환경 변수로 대체 가능
    const apiUrl = 'http://localhost:8080';
    const response = await fetch(
      `${apiUrl}/api/notifications/notification-types`,
      {
        credentials: 'include',
      }
    );

    if (response.ok) {
      return await response.json();
    }
    console.error('알림 타입 조회 실패:', await response.text());
    return [];
  } catch (error) {
    console.error('알림 타입 조회 오류:', error);
    return [];
  }
}

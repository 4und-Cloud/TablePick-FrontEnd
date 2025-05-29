// Firebase 설정 및 FCM 토큰 관리
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  type Messaging,
  onMessage,
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

// Firebase 앱 초기화
let app;
let messaging: Messaging;

// 브라우저 환경에서만 Firebase 초기화
if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Firebase 초기화 오류:', error);
  }
}

// 알림 권한 요청 함수
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }

  if (Notification.permission === 'granted') {
    console.log('알림 권한이 이미 허용되어 있습니다.');
    return true;
  }

  if (Notification.permission === 'denied') {
    console.log('알림 권한이 거부되었습니다. 브라우저 설정에서 변경해주세요.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('알림 권한이 허용되었습니다.');
      return true;
    } else {
      console.log('알림 권한이 거부되었습니다.');
      return false;
    }
  } catch (error) {
    console.error('알림 권한 요청 중 오류:', error);
    return false;
  }
}

// FCM 토큰 가져오기 (로그인 시에만 호출)
export async function getFCMToken() {
  if (!messaging) {
    console.error('Firebase 메시징이 초기화되지 않았습니다.');
    return null;
  }

  try {
    // 알림 권한 확인 및 요청
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.log('알림 권한이 없어 FCM 토큰을 가져올 수 없습니다.');
      return null;
    }

    // 서비스 워커 등록 확인
    if (!navigator.serviceWorker) {
      console.error('이 브라우저는 서비스 워커를 지원하지 않습니다.');
      return null;
    }

    // 서비스 워커 등록 상태 확인
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log('현재 등록된 서비스 워커:', registrations);

    // 서비스 워커 등록
    let swRegistration: ServiceWorkerRegistration;

    try {
      // 기존 서비스 워커 확인
      const existingFCMWorker = registrations.find(
        (reg) =>
          reg.active &&
          reg.active.scriptURL.includes('firebase-messaging-sw.js')
      );

      if (existingFCMWorker) {
        console.log(
          '기존 Firebase 메시징 서비스 워커를 사용합니다:',
          existingFCMWorker.scope
        );
        swRegistration = existingFCMWorker;
      } else {
        // 새 서비스 워커 등록
        console.log('새 서비스 워커 등록 시도...');
        swRegistration = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js'
        );
        console.log('서비스 워커 등록 성공:', swRegistration.scope);

        // 서비스 워커가 활성화될 때까지 대기
        if (!swRegistration.active) {
          console.log('서비스 워커가 활성화될 때까지 대기 중...');
          await new Promise<void>((resolve) => {
            if (swRegistration.active) {
              resolve();
              return;
            }

            swRegistration.addEventListener('updatefound', () => {
              const newWorker = swRegistration.installing;
              if (!newWorker) {
                resolve();
                return;
              }

              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  console.log('서비스 워커가 활성화되었습니다.');
                  resolve();
                }
              });
            });

            // 10초 후 타임아웃
            setTimeout(() => {
              console.log('서비스 워커 활성화 대기 타임아웃');
              resolve();
            }, 10000);
          });
        }
      }
    } catch (error) {
      console.error('서비스 워커 등록 실패:', error);
      return null;
    }

    // FCM 토큰 요청
    const currentToken = await getToken(messaging, {
      vapidKey:
        'BJU5QrpqOX0cekAcEVGx8NKmAobnUKzEfRqQGKgNvSG61sdBht3KkQPCcB2wDfbkT5NvrYIE5ktp6wBsZOrrPTw',
      serviceWorkerRegistration: swRegistration,
    });

    if (currentToken) {
      // 토큰을 로컬 스토리지에 저장하여 중복 발급 방지
      localStorage.setItem('fcm_token', currentToken);
      return currentToken;
    } else {
      console.log('FCM 토큰을 가져올 수 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('FCM 토큰 발급 중 오류:', error);
    return null;
  }
}

// 저장된 FCM 토큰 가져오기 (이미 발급된 토큰이 있으면 재사용)
export function getSavedFCMToken() {
  return localStorage.getItem('fcm_token');
}

// FCM 토큰을 서버에 저장
export async function saveFCMToken(userId: number | string, token: string) {
  if (!token) return false;

  try {
    const apiUrl = 'http://localhost:8080';
    const response = await fetch(
      `${apiUrl}/api/notifications/fcm-token?memberId=${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        credentials: 'include',
      }
    );

    if (response.ok) {
      return true;
    } else {
      console.error('FCM 토큰 저장 실패:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('FCM 토큰 저장 중 오류:', error);
    return false;
  }
}

// FCM 토큰 삭제
export async function deleteFCMToken(userId: number | string) {
  try {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('fcm_token');

    const apiUrl = 'http://localhost:8080';
    const response = await fetch(
      `${apiUrl}/api/notifications/fcm-token?memberId=${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (response.ok) {
      return true;
    } else {
      console.error('FCM 토큰 삭제 실패:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('FCM 토큰 삭제 중 오류:', error);
    return false;
  }
}

// 알림 수신 처리
export function setupNotificationListener(callback?: (payload: any) => void) {
  if (!messaging) return;

  onMessage(messaging, (payload) => {

    // 브라우저 알림 표시
    if (Notification.permission === 'granted' && payload.notification) {
      const notificationTitle = payload.notification.title || '새 알림';
      const notificationOptions = {
        body: payload.notification.body || '',
        icon: './images/logo.png',
      };

      new Notification(notificationTitle, notificationOptions);
    }

    // 콜백 함수가 있으면 호출
    if (callback && typeof callback === 'function') {
      callback(payload);
    }
  });
}

// 회원 알림 목록 조회 함수
export async function getMemberNotifications(
  memberId: number | string,
  status?: string
) {
  try {
    const apiUrl = 'http://localhost:8080';
    const url = status
      ? `${apiUrl}/api/notifications/member/${memberId}?status=${status}`
      : `${apiUrl}/api/notifications/member/${memberId}`;

    const response = await fetch(url, {
      credentials: 'include',
    });

    if (response.ok) {
      const notifications = await response.json();
      return notifications;
    } else {
      console.error('알림 목록 조회 실패:', await response.text());
      return [];
    }
  } catch (error) {
    console.error('알림 목록 조회 중 오류:', error);
    return [];
  }
}

// 알림 타입 정보 조회 함수
export async function getNotificationTypes() {
  try {
    const apiUrl = 'http://localhost:8080';
    const response = await fetch(`${apiUrl}/api/notifications/types`, {
      credentials: 'include',
    });

    if (response.ok) {
      const types = await response.json();
      return types;
    } else {
      console.error('알림 타입 조회 실패:', await response.text());
      return [];
    }
  } catch (error) {
    console.error('알림 타입 조회 중 오류:', error);
    return [];
  }
}

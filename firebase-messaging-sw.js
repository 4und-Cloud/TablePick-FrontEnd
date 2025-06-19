importScripts(
  'https://www.gstatic.com/firebasejs/11.8.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/11.8.1/firebase-messaging-compat.js'
);

console.log('Service Worker 로딩');

firebase.initializeApp({
  apiKey: 'AIzaSyA7Qw41MPAqVcpetusZjgMfEPYXis4q3RQ',
  authDomain: 'project-tablepick.firebaseapp.com',
  projectId: 'project-tablepick',
  storageBucket: 'project-tablepick.firebasestorage.app',
  messagingSenderId: '806487490296',
  appId: '1:806487490296:web:96a37b5c5e12464066850d',
  measurementId: 'G-7VLJ4SH0RF',
});

const messaging = firebase.messaging();

// 포그라운드 메시지 처리
self.addEventListener('push', (event) => {
  console.log('푸시 이벤트 수신:', event);

  if (event.data) {
    const payload = event.data.json();
    console.log('푸시 데이터:', payload);

    // FCM 데이터 구조에서 실제 알림 데이터 추출
    const data = payload.data || {};
    console.log('알림 데이터:', data);

    // 알림 제목과 내용 설정
    const notificationTitle = data.title || '새 알림';
    let notificationBody = data.body || '새로운 메시지가 도착했습니다.';

    // 식당 이름이 있는 경우 body 템플릿 처리
    if (data.restaurantName && notificationBody.includes('{restaurantName}')) {
      notificationBody = notificationBody.replace(
        '{restaurantName}',
        data.restaurantName
      );
    }

    const notificationOptions = {
      body: notificationBody,
      icon: '/images/logo.png',
      badge: '/images/logo.png',
      vibrate: [200, 100, 200],
      data: {
        id: data.id,
        type: data.type,
        status: data.status,
        memberId: data.memberId,
        reservationId: data.reservationId,
        scheduledAt: data.scheduledAt,
        sentAt: data.sentAt,
      },
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});

// 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드 메시지 수신:', payload);

  // FCM 데이터 구조에서 실제 알림 데이터 추출
  const data = payload?.data?.data || payload?.data || {};
  console.log('알림 데이터:', data);

  // 알림 제목과 내용 설정
  const notificationTitle = data.title || '새 알림';
  let notificationBody = data.body || '새로운 메시지가 도착했습니다.';

  // 식당 이름이 있는 경우 body 템플릿 처리
  if (data.restaurantName && notificationBody.includes('{restaurantName}')) {
    notificationBody = notificationBody.replace(
      '{restaurantName}',
      data.restaurantName
    );
  }

  const notificationOptions = {
    body: notificationBody,
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [200, 100, 200],
    data: {
      id: data.id,
      type: data.type,
      status: data.status,
      memberId: data.memberId,
      reservationId: data.reservationId,
      scheduledAt: data.scheduledAt,
      sentAt: data.sentAt,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] 알림 클릭됨:', event.notification);
  event.notification.close();

  // payload.data에서 URL 추출 (없으면 기본 URL)
  const url = event.notification.data?.url || '/';
  const urlToOpen = new URL(url, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        // 기존 탭이 있으면 포커스
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // 새 탭 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
      .catch((error) => {
        console.error('[firebase-messaging-sw.js] 알림 클릭 처리 오류:', error);
      })
  );
});
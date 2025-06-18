importScripts(
  'https://www.gstatic.com/firebasejs/11.8.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/11.8.1/firebase-messaging-compat.js'
);

console.log('Service Worker 로딩');

firebase.initializeApp({ 
  일부러 실패 뜨기
  apiKey: '.env에 있는 키값 넣기',
  authDomain: '.env에 있는 키값 넣기',
  projectId: '.env에 있는 키값 넣기',
  storageBucket: '.env에 있는 키값 넣기',
  messagingSenderId: '.env에 있는 키값 넣기',
  appId: '.env에 있는 키값 넣기',
  measurementId: '.env에 있는 키값 넣기',
});

const messaging = firebase.messaging();

// 포그라운드 메시지 처리
self.addEventListener('push', (event) => {

  if (event.data) {
    const payload = event.data.json();

    // FCM 데이터 구조에서 실제 알림 데이터 추출
    const data = payload.data || {};
    const notification = payload.notification || {};
    console.log('알림 데이터:', data);

    // 알림 제목과 내용 설정
    const notificationTitle = data.title || notification.title || '새 알림';
    let notificationBody = data.body || notification.body || '새로운 메시지가 도착했습니다.';

    // 식당 이름이 있는 경우 body 템플릿 처리
    if (data.restaurantName && notificationBody.includes('{restaurantName}')) {
      notificationBody = notificationBody.replace(
        '{restaurantName}',
        data.restaurantName
      );
    }

    // 이미지 URL 추출
    const imageUrl = notification.image || data.image || null;

    const notificationOptions = {
      body: notificationBody,
      icon: '/images/logo.png',
      badge: '/images/logo.png',
      image: imageUrl,
      vibrate: [200, 100, 200],
      data: {
        id: data.id,
        type: data.type,
        status: data.status,
        memberId: data.memberId,
        reservationId: data.reservationId,
        scheduledAt: data.scheduledAt,
        sentAt: data.sentAt,
        url: data.url // URL 데이터 추가
      },
      requireInteraction: true // 디버깅용: 알림이 자동 닫히지 않음
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});

// 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {

  // FCM 데이터 구조에서 데이터 추출
  const data = payload?.data || {};
  const notification = payload?.notification || {};

  // 알림 제목과 내용 설정
  const notificationTitle = data.title || notification.title || '새 알림';
  let notificationBody = data.body || notification.body || '새로운 메시지가 도착했습니다.';

  // 식당 이름이 있는 경우 body 템플릿 처리
  if (data.restaurantName && notificationBody.includes('{restaurantName}')) {
    notificationBody = notificationBody.replace(
      '{restaurantName}',
      data.restaurantName
    );
  }

  // 이미지 URL 추출
  const imageUrl = notification.image || data.image || null;

  const notificationOptions = {
    body: notificationBody,
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    image: imageUrl,
    vibrate: [200, 100, 200],
    data: {
      id: data.id,
      type: data.type,
      status: data.status,
      memberId: data.memberId,
      reservationId: data.reservationId,
      scheduledAt: data.scheduledAt,
      sentAt: data.sentAt,
      url: data.url
    },
    requireInteraction: true // 디버깅용
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
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
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
      .catch((error) => {
        console.error('[firebase-messaging-sw.js] 알림 클릭 처리 오류:', error);
      })
  );
});

console.log("[firebase-messaging-sw.js] 서비스 워커 스크립트 실행 완료");
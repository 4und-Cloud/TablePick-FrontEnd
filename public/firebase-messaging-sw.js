// Firebase 메시징 서비스 워커 파일
importScripts("https://www.gstatic.com/firebasejs/11.7.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/11.7.1/firebase-messaging-compat.js")

// 콘솔 로그 추가
console.log("[firebase-messaging-sw.js] 서비스 워커 로드됨")

// Firebase 초기화
const firebase = self.firebase

// Firebase 민감정보
firebase.initializeApp({
    apiKey: "AIzaSyA7Qw41MPAqVcpetusZjgMfEPYXis4q3RQ",
    authDomain: "project-tablepick.firebaseapp.com",
    projectId: "project-tablepick",
    storageBucket: "project-tablepick.firebasestorage.app",
    messagingSenderId: "806487490296",
    appId: "1:806487490296:web:96a37b5c5e12464066850d",
    measurementId: "G-7VLJ4SH0RF",
})

// Firebase 메시징 인스턴스 가져오기
const messaging = firebase.messaging()

// 백그라운드 메시지 핸들링
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] 백그라운드 메시지 수신:", payload)

    const notificationTitle = payload.notification.title || "알림"
    const notificationOptions = {
        body: payload.notification.body || "",
        icon: "./images/logo.png",
        data: payload.data,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})

// 서비스 워커 설치 이벤트
self.addEventListener("install", (event) => {
    console.log("[firebase-messaging-sw.js] 서비스 워커 설치됨")
    self.skipWaiting()
})

// 서비스 워커 활성화 이벤트
self.addEventListener("activate", (event) => {
    console.log("[firebase-messaging-sw.js] 서비스 워커 활성화됨")
    return self.clients.claim()
})

// 푸시 이벤트 리스너 추가
self.addEventListener("push", (event) => {
    console.log("[firebase-messaging-sw.js] 푸시 이벤트 수신:", event)

    let notificationData = {}

    try {
        notificationData = event.data.json()
    } catch (e) {
        notificationData = {
            title: "새 알림",
            body: event.data ? event.data.text() : "알림 내용이 없습니다.",
        }
    }

    const title = notificationData.notification?.title || notificationData.title || "새 알림"
    const options = {
        body: notificationData.notification?.body || notificationData.body || "",
        icon: "./images/logo.png",
        data: notificationData.data || {},
    }

    event.waitUntil(self.registration.showNotification(title, options))
})

// 알림 클릭 이벤트
self.addEventListener("notificationclick", (event) => {
    console.log("[firebase-messaging-sw.js] 알림 클릭됨:", event)

    event.notification.close()

    // 알림 클릭 시 앱 열기
    const urlToOpen = new URL("/notifications", self.location.origin).href

    event.waitUntil(
        clients
            .matchAll({
                type: "window",
                includeUncontrolled: true,
            })
            .then((windowClients) => {
                // 이미 열린 창이 있는지 확인
                for (let i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i]
                    if (client.url === urlToOpen && "focus" in client) {
                        return client.focus()
                    }
                }

                // 열린 창이 없으면 새 창 열기
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen)
                }
            }),
    )
})

console.log("[firebase-messaging-sw.js] 서비스 워커 스크립트 실행 완료")

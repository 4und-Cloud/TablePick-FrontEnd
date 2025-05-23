importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

// Firebase 설정 정보
const firebaseConfig = {
    apiKey: "AIzaSyA7Qw41MPAqVcpetusZjgMfEPYXis4q3RQ",
    authDomain: "project-tablepick.firebaseapp.com",
    projectId: "project-tablepick",
    storageBucket: "project-tablepick.firebasestorage.app",
    messagingSenderId: "806487490296",
    appId: "1:806487490296:web:96a37b5c5e12464066850d",
    measurementId: "G-7VLJ4SH0RF",
}

// Firebase 초기화
firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

// 처리된 메시지 ID를 저장할 Set
const processedMessageIds = new Set()

// 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] 백그라운드 메시지 수신:", payload)

    // 메시지 ID 생성 또는 추출
    const messageId = payload.messageId || payload.data?.messageId || `${Date.now()}-${Math.random()}`

    // 이미 처리된 메시지인지 확인
    if (processedMessageIds.has(messageId)) {
        console.log("[firebase-messaging-sw.js] 중복 메시지 무시:", messageId)
        return
    }

    // 처리된 메시지 ID 저장 (최대 50개까지)
    processedMessageIds.add(messageId)
    if (processedMessageIds.size > 50) {
        // Set은 삽입 순서를 유지하므로 첫 번째 요소를 제거
        processedMessageIds.delete(processedMessageIds.values().next().value)
    }

    // 알림 표시
    const notificationTitle = payload.notification?.title || "새 알림"
    const notificationOptions = {
        body: payload.notification?.body || "",
        icon: "./images/logo.png",
        tag: messageId, // 태그를 사용하여 동일 ID의 알림은 대체되도록 함
        data: payload.data,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})

// 알림 클릭 처리
self.addEventListener("notificationclick", (event) => {
    console.log("[firebase-messaging-sw.js] 알림 클릭됨", event)

    event.notification.close()

    // 알림 클릭 시 앱의 메인 페이지로 이동
    const urlToOpen = new URL("/", self.location.origin).href

    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true,
        })
        .then((windowClients) => {
            // 이미 열린 탭이 있는지 확인
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i]
                if (client.url === urlToOpen && "focus" in client) {
                    return client.focus()
                }
            }

            // 열린 탭이 없으면 새 탭 열기
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen)
            }
        })

    event.waitUntil(promiseChain)
})

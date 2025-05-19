// Firebase SDK를 초기화하고 FCM(Firebase Cloud Messaging) 관련 기능을 구현한 모듈

import {FirebaseApp, initializeApp} from "firebase/app"
import {getMessaging, getToken, Messaging, onMessage} from "firebase/messaging"

// Firebase 프로젝트 설정 정보
const firebaseConfig = {
    apiKey: "firebaseConfig.ts에 있는 코드 넣기",
    authDomain: "firebaseConfig.ts에 있는 코드 넣기",
    projectId: "firebaseConfig.ts에 있는 코드 넣기",
    storageBucket: "firebaseConfig.ts에 있는 코드 넣기",
    messagingSenderId: "firebaseConfig.ts에 있는 코드 넣기",
    appId: "firebaseConfig.ts에 있는 코드 넣기",
    measurementId: "firebaseConfig.ts에 있는 코드 넣기",
}

// Firebase 앱 인스턴스와 메시징 인스턴스를 저장할 변수 선언
let app: FirebaseApp | undefined
let messaging: Messaging | undefined

// 클라이언트 사이드에서만 Firebase를 초기화
if (typeof window !== "undefined") {
    try {
        app = initializeApp(firebaseConfig)
        messaging = getMessaging(app)
    } catch (error) {
        console.error("Firebase 초기화 오류:", error)
    }
}

/**
 * FCM 토큰을 가져오는 함수
 * 1. 알림 권한 확인 및 요청
 * 2. 서비스 워커 등록
 * 3. FCM 토큰 발급
 * @returns {Promise<string|null>} FCM 토큰 또는 null
 */
export async function getFCMToken() {
    if (!messaging) return null

    try {
        // 알림 권한 상태 확인
        const permission = Notification.permission

        // 알림 권한이 없으면 요청
        if (permission !== "granted") {
            const result = await Notification.requestPermission()
            if (result !== "granted") {
                console.log("알림 권한이 거부되었습니다.")
                return null
            }
        }

        // 서비스 워커 등록을 위한 변수
        let swRegistration: ServiceWorkerRegistration | undefined

        // 서비스 워커 지원 여부 확인
        if ("serviceWorker" in navigator) {
            try {
                // 기존 서비스 워커 등록 해제
                const registrations = await navigator.serviceWorker.getRegistrations()
                for (const registration of registrations) {
                    if (registration.scope.includes("firebase-messaging")) {
                        await registration.unregister()
                        console.log("기존 서비스 워커 등록 해제:", registration.scope)
                    }
                }

                // 새로운 서비스 워커 등록
                swRegistration = await navigator.serviceWorker.register("**/firebase-messaging-sw.js", {
                    scope: "/",
                })
                console.log("서비스 워커 등록 성공:", swRegistration.scope)
            } catch (error) {
                console.error("서비스 워커 등록 실패:", error)
                return null
            }
        }

        // FCM 토큰 발급 요청
        const currentToken = await getToken(messaging, {
            vapidKey: "firebaseConfig.ts에 있는 코드 넣기",
            serviceWorkerRegistration: swRegistration,
        })

        if (currentToken) {
            console.log("FCM 토큰 발급 성공:", currentToken)
            return currentToken
        } else {
            console.log("FCM 토큰을 가져올 수 없습니다.")
            return null
        }
    } catch (error) {
        console.error("FCM 토큰 발급 중 오류:", error)
        return null
    }
}

// FCM 메시지 payload 타입 정의
interface NotificationPayload {
    notification?: {
        title?: string;
        body?: string;
    };

    [key: string]: any;
}

/**
 * FCM 메시지 수신 리스너 설정 함수
 * @param callback 메시지 수신 시 실행할 콜백 함수
 */
export function setupNotificationListener(callback?: (payload: NotificationPayload) => void) {
    if (!messaging) return

    onMessage(messaging, (payload: NotificationPayload) => {
        console.log("메시지 수신:", payload)

        // 알림 권한이 있고 notification 객체가 있는 경우 브라우저 알림 표시
        if (Notification.permission === "granted" && payload.notification) {
            const notificationTitle = payload.notification.title || "알림"
            const notificationOptions = {
                body: payload.notification.body || "",
                icon: "./images/logo.png",
            }

            new Notification(notificationTitle, notificationOptions)
        }

        // 콜백 함수가 있으면 실행
        if (callback && typeof callback === "function") {
            callback(payload)
        }
    })
}
    
/**
 * 알림 예약 함수
 * @param memberId 회원 ID
 * @param notificationTypeId 알림 유형 ID
 * @param reservationId 예약 ID
 * @param scheduledAt 예약 시간
 * @returns {Promise<any|null>} 예약 결과 또는 null
 */
export async function scheduleNotification(
    memberId: number | string,
    notificationTypeId: number,
    reservationId: number,
    scheduledAt: Date,
) {
    try {
        const response = await fetch("/api/notifications/schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                memberId,
                notificationTypeId,
                reservationId,
                scheduledAt: scheduledAt.toISOString(),
            }),
        })

        if (response.ok) {
            const result = await response.json()
            console.log("알림이 성공적으로 예약되었습니다:", result)
            return result
        } else {
            console.error("알림 예약 실패:", await response.text())
            return null
        }
    } catch (error) {
        console.error("알림 예약 중 오류:", error)
        return null
    }
}

/**
 * 회원의 알림 목록을 조회하는 함수
 * @param memberId 회원 ID
 * @param status 알림 상태 (선택적)
 * @returns {Promise<Array>} 알림 목록
 */
export async function getMemberNotifications(memberId: number | string, status?: string) {
    try {
        const url = status
            ? `/api/notifications/member/${memberId}?status=${status}`
            : `/api/notifications/member/${memberId}`

        const response = await fetch(url)

        if (response.ok) {
            const notifications = await response.json()
            return notifications
        } else {
            console.error("알림 목록 조회 실패:", await response.text())
            return []
        }
    } catch (error) {
        console.error("알림 목록 조회 중 오류:", error)
        return []
    }
}

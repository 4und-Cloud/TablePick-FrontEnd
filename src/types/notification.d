// 알림 관련 타입 정의

// 알림 상태 타입
export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "CANCELLED"

// 알림 타입
export type NotificationTypes =
  | "RESERVATION_1DAY_BEFORE" // 예약 1일 전 알림
  | "RESERVATION_3HOURS_BEFORE" // 예약 3시간 전 알림
  | "RESERVATION_1HOUR_BEFORE" // 예약 1시간 전 알림
  | "RESERVATION_COMPLETED" // 예약 완료 알림
  | "REGISTER_COMPLETED" // 회원가입 완료 알림
  | "RESERVATION_3HOURS_AFTER" // 예약 3시간 후 알림

// 알림 큐 아이템 타입
export interface NotificationQueueItem {
  id: number
  notificationTypeId: number
  memberId: number
  reservationId?: number
  scheduledAt: string
  status: NotificationStatus
  retryCount: number
  createdAt: string
}

// 알림 로그 아이템 타입
export interface NotificationLogItem {
  id: number
  notificationQueueId: number
  sentAt: string
  isSuccess: boolean
  errorMessage?: string
}

// 알림 아이템 타입 (클라이언트에서 표시용)
export interface NotificationItem {
  id: number
  title: string
  message: string
  notificationType: NotificationTypes
  status: NotificationStatus
  sentAt: string
}

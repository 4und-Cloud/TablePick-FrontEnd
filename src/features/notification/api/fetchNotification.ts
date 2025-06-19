import api from "@/@shared/api/api";
import { NotificationTypes } from "@/features/notification/types/notification";
import { fetchFcmtokenUpdate } from "@/features/auth/api/fetchFcmtoken";
import { getSavedFCMToken } from "@/features/notification/lib/firebase";
import { useState, useEffect } from "react";

let notificationTypeMap: Record<NotificationTypes, number> = {} as Record<NotificationTypes, number>;
let notificationDetails: Record<NotificationTypes, { title: string; body: string; url: string }> = {} as Record<NotificationTypes, { title: string; body: string; url: string }>;

export const initializeNotificationTypeMap = async () => {
  try {
    const { status, data } = await fetchNotificationTypes();
    console.log('fetchNotificationTypes 응답:', { status, data });

    if (status >= 200 && status < 300) {
      if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
        console.error('인증 오류: 로그인 페이지 HTML 응답 수신:', data.slice(0, 100));
        throw new Error('인증되지 않은 요청입니다. 로그인이 필요합니다.');
      }

      if (!Array.isArray(data)) {
        console.error('알림 타입 데이터가 배열이 아님:', data);
        throw new Error('알림 타입 데이터가 배열 형식이 아닙니다.');
      }

      notificationTypeMap = data.reduce((map: Record<NotificationTypes, number>, item: { id: number; type: NotificationTypes }) => {
        map[item.type] = item.id;
        return map;
      }, {} as Record<NotificationTypes, number>);

      notificationDetails = data.reduce((details: Record<NotificationTypes, { title: string; body: string; url: string }>, item: { type: NotificationTypes; title: string; body: string; url: string }) => {
        details[item.type] = { title: item.title, body: item.body, url: item.url };
        return details;
      }, {} as Record<NotificationTypes, { title: string; body: string; url: string }>);

      console.log('notificationTypeMap 초기화 완료:', notificationTypeMap);
      console.log('notificationDetails 초기화 완료:', notificationDetails);
    } else {
      console.error('알림 타입 조회 실패:', { status, data });
      throw new Error(`알림 타입 조회 실패: HTTP ${status}`);
    }
  } catch (error) {
    console.error('알림 타입 조회 오류:', error);
    throw error;
  }
};

export const useNotificationTypeMapInitializer = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initializeNotificationTypeMap()
        .then(() => {
          console.log('알림 타입 초기화 완료:', notificationTypeMap, notificationDetails);
          setInitialized(true);
        })
        .catch((error) => {
          console.error('알림 타입 맵 초기화 실패:', error);
        });
    }
  }, [initialized]);

  return initialized;
};

export const fetchNotificationScheduleReservation = async (reservationId: number) => {
  if (!notificationTypeMap['RESERVATION_COMPLETED']) {
    console.warn('notificationTypeMap이 초기화되지 않음, 재시도');
    await initializeNotificationTypeMap();
    if (!notificationTypeMap['RESERVATION_COMPLETED']) {
      throw new Error('알림 타입 초기화 실패');
    }
  }

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const memberId = userInfo?.id;
  if (!memberId) {
    console.error('session storage에서 memberId를 찾을 수 없음');
    throw new Error('memberId 없음');
  }

  const fcmToken = getSavedFCMToken();
  if (!fcmToken) {
    console.error('FCM 토큰 없음');
    throw new Error('FCM 토큰 없음');
  }

  try {
    await fetchFcmtokenUpdate({ memberId, token: fcmToken });
    console.log('FCM 토큰 등록 성공');
  } catch (error) {
    console.error('FCM 토큰 등록 실패:', error);
    throw error;
  }

  const payload = {
    memberId,
    notificationTypeId: notificationTypeMap['RESERVATION_COMPLETED'],
    reservationId,
    scheduledAt: new Date().toISOString(),
    title: notificationDetails['RESERVATION_COMPLETED']?.title || '예약 완료',
    body: notificationDetails['RESERVATION_COMPLETED']?.body || '예약이 성공적으로 완료되었습니다.',
  };

  try {
    const response = await api.post(`/api/notifications/schedule/reservation/${reservationId}`, payload);
    console.log(`예약 ${reservationId}에 대한 알림 스케줄링 성공:`, response.data);
    return response.data;
  } catch (error) {
    console.error('알림 스케줄링 실패:', error);
    throw error;
  }
};

export const fetchMemberNotification = async (memberId: number, status?: string) => {
  const url = status
    ? `/api/notifications/member/${memberId}?status=${status}`
    : `/api/notifications/member/${memberId}`;

  const response = await api.get(url);
  return { status: response.status, data: response.data };
};

export const fetchNotificationTypes = async () => {
  try {
    const response = await api.get('/api/notifications/notification-types');
    console.log('fetchNotificationTypes 원본 응답:', response);
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('fetchNotificationTypes 호출 오류:', error);
    throw error;
  }
};
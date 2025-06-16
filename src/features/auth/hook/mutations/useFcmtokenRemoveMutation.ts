import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { fetchFcmtokenRemove } from '@/features/auth/api/fetchFcmtoken';
import { FcmTokenResponse } from '../../types/fcmType';

export const useFcmTokenRemoveMutation = () => {
  return useMutation<FcmTokenResponse, AxiosError, { memberId: number }>({
    mutationFn: fetchFcmtokenRemove,
    onError: (error: AxiosError) => {
      if (error.response?.status !== 401) {
        console.error('FCM 토큰 삭제 오류:', error.message);
      }
    },
  });
};
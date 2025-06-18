import { useMutation } from "@tanstack/react-query";
import { fetchFcmtokenUpdate } from "../../api/fetchFcmtoken";
import { FcmTokenUpdateInput, FcmTokenResponse } from "../../types/fcmType";

export const useFcmtokenUpdate = () => {
    return useMutation<FcmTokenResponse, Error, FcmTokenUpdateInput>({
        mutationFn: ({ memberId, token }) => {
            if (!token) {
                throw new Error('토큰 필수');
            }
            return fetchFcmtokenUpdate({ memberId, token });
        },
        onSuccess: (data) => {
        },
        onError: (error) => {
            console.error('토큰 업데이트 실패 : ', error.message);
        },
    });
};
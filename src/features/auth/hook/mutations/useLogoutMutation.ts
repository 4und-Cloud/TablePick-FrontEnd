import { useMutation } from "@tanstack/react-query";
import { fetchLogout } from "@/features/member/api/fetchMember";
import { AxiosError } from "axios";

export const useLogoutMutation = () => {
    return useMutation<void, AxiosError>({
        mutationFn: fetchLogout,
        onError: (error: AxiosError) => {
            if (error.response?.status !== 401) {
                console.error('로그아웃 오류 : ', error);
            }
        }
    })
}
// auth 커스텀 훅
import { useContext, useEffect } from "react";
import { AuthContext, AuthContextType } from "@/app/provider/AuthContext";

declare global {
  interface Window {
    Cypress?: object; // Cypress 전역 객체
    __AUTH_STATE__?: { // React 앱의 인증 상태를 노출하기 위한 커스텀 속성
      isAuthenticated: boolean;
      user: AuthContextType['user']; // AuthContextType의 user 타입을 사용
    };
  }
}

// 훅 선언
export default function useAuth(): AuthContextType {
    // AuthContext를 useContext로 꺼내기
    const context = useContext(AuthContext);

    if (!context) {
        console.error('useAuth 훅이 AuthProvider 내에서 사용되지 않았습니다.');
        throw new Error('useAuth must be used within an AuthProvider');
    }

    useEffect(() => {
        if (window.Cypress) {
            window.__AUTH_STATE__ = {
                isAuthenticated: context?.isAuthenticated,
                user: context?.user,
            };
        }
    }, [context?.isAuthenticated, context?.user])

    // 임시 데이터 받아오는 것이기 때문에 타입 단언으로 undefined가
    // 아니라는 것을 강제로 명시
    return context as AuthContextType;
};

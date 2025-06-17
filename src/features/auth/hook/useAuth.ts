// auth 커스텀 훅
import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/app/provider/AuthContext";

// 훅 선언
export default function useAuth(): AuthContextType {
    // AuthContext를 useContext로 꺼내기
    const context = useContext(AuthContext)

    if (!context) {
        console.error("AuthContext가 없습니다. AuthProvider가 상위에 있는지 확인하세요.")
        throw new Error("AuthContext가 없습니다")
    }

    return context
}

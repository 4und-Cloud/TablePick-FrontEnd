// auth 커스텀 훅
import {useContext} from "react"
import {AuthContext, type AuthContextType} from "../store/AuthContext"

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

// import { useContext } from "react";
// import { AuthContext, AuthContextType } from "../store/AuthContext";
//
// // 훅 선언
// export default function useAuth(): AuthContextType {
//     // AuthContext를 useContext로 꺼내기
//     const context = useContext(AuthContext);
//
//     if(!context) {
//         console.log('실패');
//     }
//
//     // 임시 데이터 받아오는 것이기 때문에 타입 단언으로 undefined가
//     // 아니라는 것을 강제로 명시
//     return context as AuthContextType;
// };

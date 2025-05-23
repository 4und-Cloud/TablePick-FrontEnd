// 로그인 상태 관리
import {createContext, type ReactNode, useEffect, useState} from "react"

// 임시
export interface AuthContextType {
    isAuthenticated: boolean // 로그인 여부
    user: {
        id: number | string
        email: string
        name: string
        image: string
    } // 유저 정보
    login: (user: { id: number | string; name: string; image: string; email: string }) => void // 로그인 함수
    logout: () => void // 로그아웃 함수
    loginSuccess: boolean
    setLoginSuccess: (value: boolean) => void
}

// Context 생성
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export default function AuthProvider({children}: AuthProviderProps) {
    // 로그인 여부 관리
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false)
    // 유저 정보 관리
    const [user, setUser] = useState<{ id: number | string; name: string; image: string; email: string }>({
        id: "",
        name: "",
        image: "",
        email: "",
    })

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 가져오기
        const savedUser = localStorage.getItem("infoUser")
        console.log("AuthContext - 로컬 스토리지에서 가져온 사용자 정보:", savedUser)

        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser)
                console.log("AuthContext - 파싱된 사용자 정보:", userData)

                // 사용자 ID가 있는지 확인
                if (userData && userData.id) {
                    setUser(userData)
                    setIsAuthenticated(true)
                    console.log("AuthContext - 사용자 인증 상태 설정됨:", true)
                } else {
                    console.warn("AuthContext - 사용자 ID가 없습니다:", userData)
                }
            } catch (error) {
                console.error("AuthContext - 사용자 정보 파싱 오류:", error)
            }
        }
    }, [])

    // login
    const login = (userData: { id: number | string; name: string; image: string; email: string }) => {
        console.log("AuthContext - 로그인 함수 호출됨:", userData)

        // 사용자 ID가 있는지 확인
        if (!userData.id) {
            console.error("AuthContext - 로그인 실패: 사용자 ID가 없습니다", userData)
            return
        }

        setIsAuthenticated(true)
        setUser(userData)
        localStorage.setItem("infoUser", JSON.stringify(userData))
        console.log("AuthContext - 로그인 성공, 로컬 스토리지에 저장됨")
    }

    // logout
    const logout = () => {
        console.log("AuthContext - 로그아웃 함수 호출됨")
        setIsAuthenticated(false)
        setUser({id: "", name: "", image: "", email: ""})
        localStorage.removeItem("infoUser")
        localStorage.removeItem("fcm_token")
        console.log("AuthContext - 로그아웃 완료, 로컬 스토리지에서 제거됨")
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout, loginSuccess, setLoginSuccess}}>
            {children}
        </AuthContext.Provider>
    )
}


// // 로그인 상태 관리
// import { createContext, type ReactNode, useEffect, useState } from "react"
//
// // 임시
// export interface AuthContextType {
//     isAuthenticated: boolean // 로그인 여부
//     user: {
//         id: number | string
//         email: string
//         name: string
//         image: string
//     } // 유저 정보
//     login: (user: { id: number | string; name: string; image: string; email: string }) => void // 로그인 함수
//     logout: () => void // 로그아웃 함수
//     loginSuccess: boolean
//     setLoginSuccess: (value: boolean) => void
// }
//
// // Context 생성
// export const AuthContext = createContext<AuthContextType | undefined>(undefined)
//
// interface AuthProviderProps {
//     children: ReactNode
// }
//
// export default function AuthProvider({ children }: AuthProviderProps) {
//     // 로그인 여부 관리
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
//     const [loginSuccess, setLoginSuccess] = useState<boolean>(false)
//     // 유저 정보 관리
//     const [user, setUser] = useState<{ id: number | string; name: string; image: string; email: string }>({
//         id: "",
//         name: "",
//         image: "",
//         email: "",
//     })
//
//     useEffect(() => {
//         // 로컬 스토리지에서 사용자 정보 가져오기
//         const savedUser = localStorage.getItem("infoUser")
//         console.log("AuthContext - 로컬 스토리지에서 가져온 사용자 정보:", savedUser)
//
//         if (savedUser) {
//             try {
//                 const userData = JSON.parse(savedUser)
//                 console.log("AuthContext - 파싱된 사용자 정보:", userData)
//                 setUser(userData)
//                 setIsAuthenticated(true)
//             } catch (error) {
//                 console.error("AuthContext - 사용자 정보 파싱 오류:", error)
//             }
//         }
//     }, [])
//
//     // login
//     const login = (userData: { id: number | string; name: string; image: string; email: string }) => {
//         console.log("AuthContext - 로그인 함수 호출됨:", userData)
//         setIsAuthenticated(true)
//         setUser(userData)
//         localStorage.setItem("infoUser", JSON.stringify(userData))
//     }
//
//     // logout
//     const logout = () => {
//         console.log("AuthContext - 로그아웃 함수 호출됨")
//         setIsAuthenticated(false)
//         setUser({ id: "", name: "", image: "", email: "" })
//         localStorage.removeItem("infoUser")
//     }
//
//     return (
//         <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loginSuccess, setLoginSuccess }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

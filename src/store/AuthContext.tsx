// 로그인 상태 관리
import {createContext, ReactNode, useState} from "react";

// 임시
export interface AuthContextType {
    isAuthenticated: boolean; // 로그인 여부
    user: {
        name: string;
        image? : string;
    }; // 유저 정보
    login: ( user: {name: string; image: string}) => void; // 로그인 함수 
    logout: () => void; // 로그아웃 함수

}

// Context 생성
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({children} : AuthProviderProps) {
    // 로그인 여부 관리
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    // 유저 정보 관리
    const [user, setUser] = useState<{name: string; image: string}>({name: '', image:''});
    // login
    const login = (userData: {name: string; image: string}) => {
        setIsAuthenticated(true);
        setUser(userData);
    };
    // logout
    const logout = () => {
        setIsAuthenticated(false);
        setUser({name: '', image: ''})
    };
    return(
        <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
 }

    
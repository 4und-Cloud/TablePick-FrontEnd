// 로그인 상태 관리
import {createContext, ReactNode, useEffect, useState} from "react";

// 임시
export interface AuthContextType {
    isAuthenticated: boolean; // 로그인 여부
    user: {
        email: string;
        name: string;
        image : string;
    }; // 유저 정보
    login: ( user: {name: string; image: string; email: string;}) => void; // 로그인 함수 
    logout: () => void; // 로그아웃 함수
    loginSuccess : boolean;
    setLoginSuccess: (value: boolean) => void;
}

// Context 생성
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({children} : AuthProviderProps) {
    // 로그인 여부 관리
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    // 유저 정보 관리
    const [user, setUser] = useState<{name: string; image: string; email: string;}>({name: '', image:'', email:''});

    useEffect(() => {
        const savedUser = localStorage.getItem('infoUser');
        if(savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setIsAuthenticated(true);
        }
    }, []);

    // login
    const login = (userData: {name: string; image: string; email: string;}) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('infoUser', JSON.stringify(userData));
    };
    
    // logout
    const logout = () => {
        setIsAuthenticated(false);
        setUser({name: '', image: '', email:''});
        localStorage.removeItem('infoUser');
    };
    return(
        <AuthContext.Provider value={{isAuthenticated, user, login, logout, loginSuccess , setLoginSuccess}}>
            {children}
        </AuthContext.Provider>
    )
 }

    
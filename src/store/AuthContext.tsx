import { createContext, type ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import defaultProfile from '@/assets/images/user.png';
export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  gender?: string;
  birthdate?: string;
  phoneNumber?: string;
  memberTags?: number[];
  createAt?: string;
  isNewUser?: boolean;
}
export interface AuthContextType {
  isAuthenticated: boolean; // 로그인 여부
  user: UserInfo;
  login: (user: UserInfo) => void; // 로그인 함수
  logout: () => Promise<void>; // 로그아웃 함수
  loginSuccess: boolean;
  setLoginSuccess: (value: boolean) => void;
}
// Context 생성
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
interface AuthProviderProps {
  children: ReactNode;
}
export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  // 로그인 여부 관리
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  // 유저 정보 관리
  const [user, setUser] = useState<UserInfo>({
    id: 0,
    nickname: '',
    profileImage: defaultProfile,
    email: '',
    gender: '',
    birthdate: '',
    phoneNumber: '',
    memberTags: [],
    createAt: '',
    isNewUser: false
  });

   // logout => 해결
  const logout = async () => {
    try {
      await api.post('/api/members/logout');
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('로그아웃 오류 : ', error);
      }
    }
    try {
      if (user?.id) {
        await api.patch(`/api/notifications/fcm-token/remove?memberId=${user.id}`);
      }
    } catch (error : any) {
      if (error.response?.status !== 401) {
        console.error('FCM 토큰 삭제 오류', error);
      }
    }
    setIsAuthenticated(false);
    setUser({
      id: 0,
      nickname: '',
      profileImage: defaultProfile,
      email: '',
      gender: '',
      phoneNumber: '',
      memberTags: [],
      createAt: '',
      isNewUser: false,
    });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('fcm_token');
    navigate('/');
  };

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const savedUser = localStorage.getItem('userInfo');

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // 사용자 ID가 있는지 확인
        if (userData && userData.id) {
          setUser({...userData, isNewUser: userData.isNewUser || false});
          setIsAuthenticated(true);
        } else {
          console.warn('AuthContext - 사용자 ID가 없습니다:', userData);
        }
      } catch (error) {
        console.error('AuthContext - 사용자 정보 파싱 오류:', error);
      }
    }
    
  }, []);

  useEffect(() => {
    const handleLogout = async () => {
      try {
          await logout();
          navigate('/');
      } catch (error) {
        console.error('로그아웃 오류 : ', error);
        navigate('/');
      } 
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [navigate, logout]);

  // login
  const login = (userData: UserInfo) => {
    setIsAuthenticated(true);
    setUser(userData);
  };
 
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loginSuccess,
        setLoginSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

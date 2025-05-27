import { createContext, type ReactNode, useEffect, useState } from 'react';
export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  gender?: string;
  birthdate?: string;
  phoneNumber?: string;
  memberTags?: number[];
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
  // 로그인 여부 관리
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  // 유저 정보 관리
  const [user, setUser] = useState<UserInfo>({
    id: 0,
    nickname: '',
    profileImage: '',
    email: '',
    gender: '',
    birthdate: '',
    phoneNumber: '',
    memberTags: [],
  });
  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const savedUser = localStorage.getItem('userInfo');
    console.log(
      'AuthContext - 로컬 스토리지에서 가져온 사용자 정보:',
      savedUser
    );
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('AuthContext - 파싱된 사용자 정보:', userData);
        // 사용자 ID가 있는지 확인
        if (userData && userData.id) {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('AuthContext - 사용자 인증 상태 설정됨:', true);
        } else {
          console.warn('AuthContext - 사용자 ID가 없습니다:', userData);
        }
      } catch (error) {
        console.error('AuthContext - 사용자 정보 파싱 오류:', error);
      }
    }
  }, []);
  // login
  const login = (userData: UserInfo) => {
    console.log('AuthContext - 로그인 함수 호출됨:', userData);
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    console.log('AuthContext - 로그인 성공, 로컬 스토리지에 저장됨');
  };
  // logout => 해결
  const logout = async () => {
    console.log('AuthContext - 로그아웃 함수 호출됨');
    try {
      const apiUrl = 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/members/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include', // 세션 쿠키 포함
      });
      if (!res.ok) {
        throw new Error('로그아웃 요청 실패');
      }
    } catch (error) {
      console.log('로그아웃 api 호출 중 에러: ', error);
    }
    // 클라이언트 상태 초기화
    setIsAuthenticated(false);
    setUser({
      id: 0,
      nickname: '',
      profileImage: '',
      email: '',
      gender: '',
      phoneNumber: '',
      memberTags: [],
    });
    // 로컬 스토리지 초기화
    localStorage.removeItem('userInfo');
    localStorage.removeItem('fcm_token');
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

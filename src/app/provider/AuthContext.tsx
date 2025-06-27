import { createContext, type ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '@/@shared/images/user.png';
import { fetchLogout } from '@/features/member/api/fetchMember';
import { fetchFcmtokenRemove } from '@/features/auth/api/fetchFcmtoken';

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

// Cypress 테스트 환경에서 window 객체에 추가될 속성을 선언합니다.
declare global {
  interface Window {
    Cypress?: object;
    __AUTH_STATE__?: {
      isAuthenticated: boolean;
      user: UserInfo; // 🚩 수정: user 타입을 UserInfo | null -> UserInfo 로 변경하여 AuthContextType와 일관성 유지
    };
    __AUTH_ACTIONS__?: {
      login: (userData: UserInfo) => void;
      isAuthenticated: boolean;
      user: UserInfo; // 🚩 수정: user 타입을 UserInfo | null -> UserInfo 로 변경하여 AuthContextType와 일관성 유지
    };
  }
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
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

  useEffect(() => {
    const handleAuthSync = () => {
      const savedUser = sessionStorage.getItem('userInfo');
      console.log('🧪 auth:sync 이벤트 발생, savedUser:', savedUser);
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('🧪 userData:', userData);
          if (userData?.id) {
            setUser({ ...userData, isNewUser: userData.isNewUser || false });
            setIsAuthenticated(true);
            console.log('🧪 auth:sync 성공, isAuthenticated:', true);
          } else {
            console.warn('🧪 userData에 id가 없음:', userData);
          }
        } catch (err) {
          console.error('🧪 auth:sync 오류:', err);
        }
      } else {
        console.warn('🧪 sessionStorage에 userInfo 없음');
      }
    };
    window.addEventListener('auth:sync', handleAuthSync);
    return () => window.removeEventListener('auth:sync', handleAuthSync);
  }, []);

  useEffect(() => {
    const initUser = () => {
      const savedUser = sessionStorage.getItem('userInfo');
      console.log('🧪 초기화, savedUser:', savedUser);
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          if (userData?.id) {
            setUser({ ...userData, isNewUser: userData.isNewUser || false });
            setIsAuthenticated(true);
            console.log('🧪 초기화 성공, isAuthenticated:', true);
          }
        } catch (err) {
          console.error('🧪 초기화 오류:', err);
        }
      }
    };
    initUser();
  }, []);

  const logout = async () => {
    try {
      await fetchLogout();
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('로그아웃 오류 : ', error);
      }
    }

    try {
      if (user?.id) {
        await fetchFcmtokenRemove({memberId : user.id});
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
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('fcm_token');
    navigate('/');
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem('userInfo');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
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
    // 🚩 추가: 실제 애플리케이션에서 로그인 후 사용자 정보를 sessionStorage에 저장하는 로직
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
    sessionStorage.setItem('fcm_token', 'mock-fcm-token-for-test-env'); // FCM 토큰도 함께 저장
  };
 
  // 🚩 MAJOR CHANGE: Cypress 테스트를 위해 window 객체에 인증 액션들을 노출하는 useEffect
  // 빈 의존성 배열을 사용하여 컴포넌트가 마운트된 후 한 번만 실행되도록 보장합니다.
  useEffect(() => {
    if (window.Cypress) {
      console.log('AuthProvider: Cypress 환경 감지. __AUTH_ACTIONS__ 노출 중...');
      (window as any).__AUTH_ACTIONS__ = {
        login: (userData: UserInfo) => {
          // AuthProvider의 상태 설정 함수들을 직접 호출하여 내부 상태를 업데이트합니다.
          setIsAuthenticated(true);
          setUser(userData);
          // 🚩 중요: 직접 로그인 시에도 애플리케이션이 기대하는 sessionStorage 값 설정
          sessionStorage.setItem('userInfo', JSON.stringify(userData));
          sessionStorage.setItem('fcm_token', 'mock-fcm-token-for-test-env');
          console.log('Cypress: __AUTH_ACTIONS__.login 함수 직접 호출됨.');
        },
        // 현재 인증 상태와 사용자 정보도 Cypress에서 디버깅용으로 참조할 수 있도록 노출
        isAuthenticated: isAuthenticated,
        user: user,
      };
      // 기존 __AUTH_STATE__도 유지하여 이전 확인 로직과 호환되도록 합니다.
      // 이 값은 이 useEffect가 실행될 때의 초기값을 반영하며, 이후 상태 변경은 직접 호출된 login 함수가 담당합니다.
      window.__AUTH_STATE__ = {
        isAuthenticated: isAuthenticated,
        user: user,
      };
      console.log('AuthProvider: __AUTH_ACTIONS__ 및 __AUTH_STATE__가 Cypress용으로 설정됨.');
    } else {
      console.log('AuthProvider: Cypress 환경이 아님.');
    }
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

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

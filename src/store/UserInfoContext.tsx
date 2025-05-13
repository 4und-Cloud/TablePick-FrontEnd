import { createContext, useContext, useState, useEffect } from 'react';

interface UserExtraInfo {
  gender: string;
  birthday: string;
  phone: string;
  tags: string[];
}

interface UserExtraInfoContextType {
  userInfo: UserExtraInfo | null;
  setUserInfo: (info: UserExtraInfo) => void;
}

const UserExtraInfoContext = createContext<UserExtraInfoContextType | undefined>(undefined);

export const UserExtraInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfoState] = useState<UserExtraInfo | null>(null);

  // localStorage 연동 (선택사항)
  useEffect(() => {
    const stored = localStorage.getItem('userExtraInfo');
    if (stored) {
      setUserInfoState(JSON.parse(stored));
    }
  }, []);

  const setUserInfo = (info: UserExtraInfo) => {
    setUserInfoState(info);
    localStorage.setItem('userExtraInfo', JSON.stringify(info)); // 새로고침에도 유지
  };

  return (
    <UserExtraInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserExtraInfoContext.Provider>
  );
};

export const useUserExtraInfo = () => {
  const context = useContext(UserExtraInfoContext);
  if (!context) {
    throw new Error('useUserExtraInfo must be used within a UserExtraInfoProvider');
  }
  return context;
};
import pic from '@/@shared/images/login.png';
import {
  getFCMToken,
  getSavedFCMToken,
  saveFCMToken,
} from '../../../features/notification/lib/firebase';
import { useState } from 'react';
import api from '../../api/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const baseClasses =
    'w-[300px] h-12 flex items-center justify-center rounded font-medium text-base cursor-pointer px-4 mb-3';
  const iconClasses = 'mr-2 w-5 h-5';

  if (!isOpen) return null;

  // 로그인 처리 함수
  const handleLogin = async (provider: string) => {
    try {
      setIsLoggingIn(true);

      const currentUrl = window.location.pathname + window.location.search;
      const redirectUrl = encodeURIComponent(currentUrl);

      // 로그인 성공 후 FCM 토큰 처리를 위한 이벤트 리스너 설정
      window.addEventListener(
        'message',
        async (event) => {
          // 로그인 성공 메시지를 받았을 때
          if (
            event.data &&
            event.data.type === 'LOGIN_SUCCESS' &&
            event.data.userId
          ) {
            const userId = event.data.userId;

            // 저장된 FCM 토큰이 있는지 확인
            let fcmToken = getSavedFCMToken();

            // 저장된 토큰이 없으면 새로 발급
            if (!fcmToken) {
              fcmToken = await getFCMToken();
            }

            // 서버에 토큰 저장
            if (fcmToken) {
              await saveFCMToken(userId, fcmToken);
            }
          }
          setIsLoggingIn(false);
        },
        { once: true }
      );

      window.location.href = `${api.defaults.baseURL}/oauth2/authorization/${provider}?redirect=${redirectUrl}`;
    } catch (error) {
      console.error('로그인 처리 중 오류:', error);
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-login w-[800px] h-[600px] shadow-2xl flex relative">
          <button
            onClick={onClose}
            className="absolute text-black top-4 right-4 text-2xl z-10"
          >
            ×
          </button>
          {/* 왼쪽 영역 */}
          <div className="w-1/2 flex items-center justify-center ">
            <img width={400} height={600} src={pic} alt="로그인 이미지" />
          </div>
          <div className="absolute bg-black bg-opacity-10 left-1/2 w-px h-full transform -translate-x-1/2"></div>
          {/* 오른쪽 영역 */}
          <div className="bg-login w-1/2 flex-col flex items-center justify-center">
            <p className="text-main text-[40px] mb-[100px] font-bold">Login</p>
            <div className="flex items-center flex-col gap-4">
              <button
                onClick={() => handleLogin('kakao')}
                disabled={isLoggingIn}
                className={`${baseClasses} bg-[#FEE500] text-black hover:opacity-90 transition ${
                  isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg
                  className={iconClasses}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 4C7.58172 4 4 6.69091 4 10C4 12.0855 5.55757 13.8727 7.8356 14.8144C7.63281 15.5183 6.88924 17.8208 6.85962 17.9345C6.85962 17.9345 6.84192 18.0706 6.94567 18.1345C7.04942 18.1985 7.15317 18.1541 7.15317 18.1541C7.31338 18.1007 10.1615 16.097 10.8512 15.6399C11.2267 15.6845 11.6092 15.7091 12 15.7091C16.4183 15.7091 20 13.0182 20 9.70909C20 6.4 16.4183 4 12 4Z"
                    fill="black"
                  />
                </svg>
                카카오 계정으로 로그인
              </button>
              <button
                onClick={() => handleLogin('google')}
                disabled={isLoggingIn}
                className={`${baseClasses} bg-white text-black border border-[#dadce0] hover:bg-gray-100 transition ${
                  isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg
                  className={iconClasses}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                구글 계정으로 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

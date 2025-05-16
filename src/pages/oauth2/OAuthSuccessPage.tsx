import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// 쿠키에서 토큰 가져오기 (현재는 미사용 중)
function getTokenFromCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export default function OauthSuccess() {
  const {login} = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nickname: string; profileImage: string; email:string;} | null>(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try{
        const response = await axios.get('http://localhost:8080/api/members', {
          headers: {
            Accept: 'application/json',
          },
          withCredentials: true,
        });

        const userData = response.data;
        if(!userData.nickname || !userData.profileImage || !userData.email) {
          throw new Error('잘못된 사용자 데이터');
        }

        setUser({
          email: userData.email,
          nickname: userData.nickname,
          profileImage: userData.profileImage,
        });

        login({
          email: userData.email,
          name: userData.nickname,
          image: userData.profileImage,
        });

        localStorage.setItem('userInfo', JSON.stringify({
          email: userData.email,
          nickname: userData.nickname,
          profileImage: userData.profileImage,
        }));

      
        alert('로그인 성공');
        navigate('/', {state: {showFilterModal : true}});
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, [login, navigate]);

  return <div className='mt-[80px]'>로그인 중입니다...</div>;
}
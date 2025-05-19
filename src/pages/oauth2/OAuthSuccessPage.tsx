import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function OauthSuccess() {
  const {login} = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nickname: string; profileImage: string; email:string;} | null>(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try{
        // 쿼리 파라미터에서 프로바이더 확인
        const params = new URLSearchParams(location.search);
        const provider = params.get('provider') || 'kakao';

        const response = await axios.get('http://localhost:8080/api/members', {
          headers: {
            Accept: 'application/json',
          },
          withCredentials: true,
        });

        const userData = response.data;
        console.log(userData)
        if( !userData.email) {
          throw new Error('잘못된 사용자 데이터');
        }

        const normalizedUser = {
          email: userData.email,
          nickname: userData.nickname || userData.name || '익명 사용자',
          profileImage: userData.profileImage || userData.picture
        }

        setUser(normalizedUser);

        login({
          email: normalizedUser.email,
          name: normalizedUser.nickname,
          image: normalizedUser.profileImage,
        });

        localStorage.setItem('userInfo', JSON.stringify(normalizedUser
        ));

      
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
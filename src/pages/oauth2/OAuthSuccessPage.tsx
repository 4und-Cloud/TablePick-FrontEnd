// src/pages/OauthSuccess.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OauthSuccess() { 
  console.log("동작 체킁");
  const navigate = useNavigate();
  const [user, setUser] = useState<{nickname: string; profileImageUrl: string} | null>(null);

  useEffect(() => {
    axios.post(
          'http://localhost:8080/api/members',
          {}, // 요청 본문 (필요 시 데이터 추가)
          {
            withCredentials: true, // 쿠키(Refresh Token) 포함
          }
    );
    
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");


    console.log('accessToken: ',accessToken);

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);

      fetch('http://localhost:8080/api/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => res.json())
      .then(user => {
        setUser({
          nickname: user.nickname,
          profileImageUrl: user.profileImageUrl,
        });
        alert('로그인 성공');
        navigate('/');
      })
    }
  }, []);

  return <div>로그인 중입니다...</div>;
}

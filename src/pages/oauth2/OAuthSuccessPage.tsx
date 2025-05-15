// src/pages/OauthSuccess.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OauthSuccess() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{nickname: string; profileImageUrl: string} | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    console.log('accessToken: ',accessToken);

    if (accessToken ) {
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

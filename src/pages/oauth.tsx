// 예: /oauth2/redirect 라는 페이지에서 처리한다고 가정
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuth2RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/oauth2/redirect`, {
      credentials: 'include',
    })
      .then(async (response) => {
        // ✅ AccessToken 가져오기 (Header에서)
        const token = response.headers.get('Authorization')?.replace('Bearer ', '');

        // ✅ 사용자 정보 가져오기 (Body에서)
        const userData = await response.json();

        if (token) {
          // 토큰 로컬스토리지나 리코일/컨텍스트 등에 저장
          localStorage.setItem('accessToken', token);
        }

        if (userData) {
          // 사용자 정보도 저장
          localStorage.setItem('user', JSON.stringify(userData));
        }

        // 메인 페이지로 이동
        navigate('/');
      })
      .catch((error) => {
        console.error('OAuth 처리 실패:', error);
        navigate('/login');
      });
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
}

export default OAuth2RedirectHandler;
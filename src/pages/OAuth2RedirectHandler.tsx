import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // 1. 토큰 저장
      localStorage.setItem('accessToken', token);

      // 2. 사용자 정보 요청 (예: 사용자 태그가 등록되었는지 확인)
      axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        const user = res.data;

        if (user.hasTag) {
          // 태그가 이미 있다면 홈으로 이동
          navigate('/');
        } else {
          // 태그 없으면 모달 띄우도록 홈으로 이동 + 상태 전달
          navigate('/', { state: { showTagModal: true, user } });
        }
      }).catch(() => {
        alert('로그인 실패');
        navigate('/');
      });
    } else {
      navigate('/');
    }
  }, [navigate, searchParams]);

  return <div>로그인 처리 중입니다...</div>;
}
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

export default function KakaoRedirect() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fetchKakaoUser = async () => {
      const code = new URL(window.location.href).searchParams.get("code");

      if (!code) {
        alert("인가 코드 없음");
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_TABLE_PICK_API_URL}/auth/signIn/Kakao`, 
          {
            token: code, // Kakao 인가 코드
            redirectUrl: import.meta.env.VITE_REDIRECT_URI, // 리다이렉트 URL
          },
          {
            withCredentials: true, // 자격 증명 포함
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(response.data);
        
        // 로그인 성공 시 처리
        if (response.data && response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);

          // 로그인 상태 업데이트
          login(response.data);

          // 로그인 후 메인 화면으로 이동
          navigate('/');
        }
      } catch (error) {
        console.error('로그인 실패', error);
      }
    };

    fetchKakaoUser();
  }, [login, navigate]);

  return <div>로그인 중...</div>;
}

// // pages/oauth2/GoogleRedirect.tsx
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const GoogleRedirect = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_TABLE_PICK_API__URL}/oauth2/redirect`, )
//     const fetchTokenAndUser = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/oauth2/redirect`, {
//           method: 'GET',
//           credentials: 'include',
//         });

//         // ✅ Access Token 가져오기 (헤더)
//         const token = response.headers.get('Authorization')?.replace('Bearer ', '');
//         console.log(token);

//         // ✅ 사용자 정보 가져오기 (본문)
//         const userData = await response.json();

//         if (token) {
//           localStorage.setItem("accessToken", token);
//         } else {
//           alert("로그인 실패: 토큰이 없습니다.");
//           return navigate('/login');
//         }

//         if (userData) {
//           localStorage.setItem("nickname", userData.nickname || '');
//           localStorage.setItem("profileImage", userData.profileImage || '');
//         }

//         alert("로그인 성공!");
//         navigate('/');
//       } catch (error) {
//         console.error('OAuth 처리 실패:', error);
//         alert("로그인 실패: 서버 오류");
//         navigate('/login');
//       }
//     };

//     fetchTokenAndUser();
//   }, [navigate]);

//   return <div>로그인 처리 중입니다...</div>;
// };

// export default GoogleRedirect;

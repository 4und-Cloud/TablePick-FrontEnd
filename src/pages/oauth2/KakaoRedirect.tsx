// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth"; // 로그인 상태 관리 훅
// import OAuthSuccessPage from "./OAuthSuccessPage"; // 로그인 성공 후 페이지

// export default function OAuth2Redirect() {
//   const navigate = useNavigate();
//   const { login } = useAuth(); // login 함수

//   useEffect(() => {
//     const code = new URL(window.location.href).searchParams.get("code");

//     if (code) {
//       fetch("http://localhost:8080/api/oauth2/kakao", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ code }),
//         credentials: "include", // 쿠키를 포함시켜서 서버와 세션 관리
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Login failed");
//           return res.json(); // 응답을 JSON으로 변환
//         })
//         .then((data) => {
//           console.log("로그인 성공", data);

//           // 응답에서 accessToken을 localStorage에 저장
//           if (data.accessToken) {
//             localStorage.setItem("accessToken", data.accessToken); // 토큰 저장
//           }

//           // 로그인 상태 업데이트 (필요한 경우)
//           login(data.user); // user 데이터가 있다면 상태 업데이트

//           // 로그인 후 홈 화면으로 리디렉션
//           navigate('/');
//         })
//         .catch((err) => {
//           console.error("로그인 실패", err);
//         });
//     }
//   }, [navigate, login]); // 의존성 배열에 navigate와 login 추가

//   return <div>로그인 처리 중입니다...</div>;
// }

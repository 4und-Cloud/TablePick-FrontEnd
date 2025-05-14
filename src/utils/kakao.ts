export const kakaoLoginHandler = () => {
    const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

    console.log(REST_API_KEY);
    console.log(REDIRECT_URI);
    const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = link;
};
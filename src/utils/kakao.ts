export const kakaoLoginHandler = () => {
    const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    console.log('REDIRECT_URI:', REDIRECT_URI)
    console.log('REST_API_KEY:', REST_API_KEY)

    // console.log(REST_API_KEY);
    // console.log(REDIRECT_URI);
    const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;    
    window.location.href = link;
};
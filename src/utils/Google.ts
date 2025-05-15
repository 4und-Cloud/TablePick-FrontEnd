export const googleLoginHandler = async (credential: string) => {
    console.log('googleLoginHandler 호출됨');
    const response = await fetch('http://localhost:8080/auth/signIn/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credential}`,
      },
      body: JSON.stringify({
        redirectUrl: window.location.origin,
        state: 'google-login',
      }),
    });
  
    // 요청 실패 시 response status와 함께 오류 메시지 출력
    if (!response.ok) {
      console.error('로그인 실패. 상태 코드:', response.status);
      const errorText = await response.text(); // 서버에서 반환된 에러 메시지
      console.error('서버 응답:', errorText);
      throw new Error('로그인 실패');
    }
  
    const data = await response.json(); // { accessToken, nickname, profileImage, ... }
  
    console.log('서버에서 받은 데이터:', data); // 로그인 후 받은 데이터 출력
  
    // 액세스 토큰을 localStorage에 저장
    localStorage.setItem('accessToken', data.accessToken);
    console.log('accessToken:', data.accessToken);
  
    // nickname, profileImage 등도 저장 가능
    localStorage.setItem('nickname', data.nickname);
    localStorage.setItem('profileImage', data.profileImage);
  
    return data; // 로그인 후 반환된 데이터 반환 (필요한 경우)
  };
  
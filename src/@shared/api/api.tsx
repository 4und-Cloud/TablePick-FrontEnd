import axios from "axios";


const api = axios.create({
   baseURL: import.meta.env.VITE_TABLE_PICK_API_URL,
  headers: {
    Accept: 'application/json'
  },
  withCredentials: true
});

const triggerLogoutEvent = () => {
  const event = new Event('auth:logout');
  window.dispatchEvent(event);
};

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token'); // 토큰 저장 위치 확인
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API 요청 헤더:', config.headers); // 디버깅 로그
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '' &&
      originalRequest.url !== '/' &&
      originalRequest.url !== '/api/members/logout' &&
      !originalRequest.url.includes('/api/notifications/fcm-token/remove')
    ) {
      originalRequest._retry = true;

      console.log('401 세션 만료 로그아웃');
      alert('토큰이 만료되었습니다 다시 로그인해주세요!');

      triggerLogoutEvent();

      return Promise.reject(new Error('토큰 만료로 로그아웃 처리되었습니다.'));
    }
    return Promise.reject(error);
  }
);

export default api;
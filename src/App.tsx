import './App.css'
<<<<<<< HEAD
<<<<<<< HEAD
import { useLocation } from 'react-router-dom'
=======
import { BrowserRouter } from "react-router-dom"
>>>>>>> bacdb6f (feat : 로그인용 헤더, 비로그인용 헤더 컴포넌트 구현)
=======
import { useLocation } from 'react-router-dom'
>>>>>>> 37a7499 (feat/공통 컴포넌트 버튼 구현 및 적용 / 헤더 조건부 렌더링 처리)
import PageRouter from "./routes/pageRouter"
import UnAuthHeader from './components/Header/UnAuthHeader'
import AuthHeader from './components/Header/AuthHeader'
import useAuth from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth();
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 37a7499 (feat/공통 컴포넌트 버튼 구현 및 적용 / 헤더 조건부 렌더링 처리)
  // 현재 경로 가져오기
  const location = useLocation();

  // 헤더 숨길 경로 설정
  const hiddenHeaderRoutes = ['/login'];
  const shouldShowHeader = !hiddenHeaderRoutes.includes(location.pathname);
<<<<<<< HEAD

  return (
      <div className="bg-background w-full min-h-screen flex justify-center items-center">
        <div className='relative bg-white w-[1200px] min-h-screen mx-auto'>
          {shouldShowHeader && (isAuthenticated ? <AuthHeader /> : <UnAuthHeader />)}
          <PageRouter />
        </div>
      </div>
=======
=======
>>>>>>> 37a7499 (feat/공통 컴포넌트 버튼 구현 및 적용 / 헤더 조건부 렌더링 처리)

  return (
      <div className="bg-background w-full min-h-screen flex justify-center items-center">
        <div className='bg-white w-[1200px] min-h-screen mx-auto'>
          {shouldShowHeader && (isAuthenticated ? <AuthHeader /> : <UnAuthHeader />)}
          <PageRouter />
        </div>
      </div>
<<<<<<< HEAD
    </BrowserRouter>
>>>>>>> bacdb6f (feat : 로그인용 헤더, 비로그인용 헤더 컴포넌트 구현)
=======
>>>>>>> 37a7499 (feat/공통 컴포넌트 버튼 구현 및 적용 / 헤더 조건부 렌더링 처리)
    
    
    
  )
}

export default App

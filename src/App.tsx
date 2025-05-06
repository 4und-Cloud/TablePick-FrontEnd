import './App.css'
<<<<<<< HEAD
import { useLocation } from 'react-router-dom'
=======
import { BrowserRouter } from "react-router-dom"
>>>>>>> bacdb6f (feat : 로그인용 헤더, 비로그인용 헤더 컴포넌트 구현)
import PageRouter from "./routes/pageRouter"
import UnAuthHeader from './components/Header/UnAuthHeader'
import AuthHeader from './components/Header/AuthHeader'
import useAuth from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth();
<<<<<<< HEAD
  // 현재 경로 가져오기
  const location = useLocation();

  // 헤더 숨길 경로 설정
  const hiddenHeaderRoutes = ['/login'];
  const shouldShowHeader = !hiddenHeaderRoutes.includes(location.pathname);

  return (
      <div className="bg-background w-full min-h-screen flex justify-center items-center">
        <div className='bg-white w-[1200px] min-h-screen mx-auto'>
          {shouldShowHeader && (isAuthenticated ? <AuthHeader /> : <UnAuthHeader />)}
          <PageRouter />
        </div>
      </div>
=======

  return (
    <BrowserRouter>
      <div className="bg-background w-full min-h-screen flex justify-center items-center">
        <div className='bg-white w-[1200px] min-h-screen mx-auto'>
          {isAuthenticated ? <AuthHeader /> : <UnAuthHeader />}
          <PageRouter />
        </div>
      </div>
    </BrowserRouter>
>>>>>>> bacdb6f (feat : 로그인용 헤더, 비로그인용 헤더 컴포넌트 구현)
    
    
    
  )
}

export default App

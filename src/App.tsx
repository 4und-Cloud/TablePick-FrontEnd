import './App.css'
import PageRouter from "./routes/pageRouter"
import AuthHeader from './components/Header/AuthHeader'
import UnAuthHeader from './components/Header/UnAuthHeader'
import useAuth from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="relative w-full min-h-screen flex justify-center bg-white">
      {/* 전체 상단 보더 */}
      <div className="absolute top-0 left-0 w-full h-[97px] z-0 border-b border-main" />

      {/* 실제 콘텐츠 영역 */}
      <div className="relative z-10 w-[1200px] min-h-screen bg-white">
        {isAuthenticated ? <AuthHeader /> : <UnAuthHeader />}

        {/* 헤더 하단 보더 */}
        <div className="w-full h-px bg-main" />

        <PageRouter />
      </div>
    </div>
  )
}

export default App;
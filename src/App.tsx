import './App.css';
import PageRouter from './routes/pageRouter';
import AuthHeader from './components/Header/AuthHeader';
import UnAuthHeader from './components/Header/UnAuthHeader';
import useAuth from './hooks/useAuth';

function App() {
<<<<<<< HEAD
  return (
    <div className="relative w-full min-h-screen flex justify-center bg-white">
      {/* 전체 상단 보더 */}
      <div className="absolute top-0 left-0 w-full h-[97px] z-20 border-b border-main" />

      {/* 실제 콘텐츠 영역 */}
      <div className="relative z-10 w-[1200px] min-h-screen bg-white">
        <Header />
        <PageRouter />
      </div>
    </div>
  )
=======
    const {isAuthenticated} = useAuth();
    return (
        <div className="relative w-full min-h-screen flex justify-center bg-white">
            {/* 전체 상단 보더 /}
      <div className="absolute top-0 left-0 w-full h-[97px] z-0 border-b border-main" />

      {/ 실제 콘텐츠 영역 */}
            <div className="relative z-10 w-[1200px] min-h-screen bg-white">
                {isAuthenticated ? <AuthHeader/> : <UnAuthHeader/>}
                <PageRouter/>
            </div>
        </div>
    );
>>>>>>> 5f5f8e81c804eb1fcf31ce362911a9336c354061
}

export default App;

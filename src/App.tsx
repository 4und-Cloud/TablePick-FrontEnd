import './App.css';
import PageRouter from './routes/pageRouter';
import AuthHeader from './components/Header/AuthHeader';
import UnAuthHeader from './components/Header/UnAuthHeader';
import useAuth from './hooks/useAuth';

export default function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="relative w-full min-h-screen flex justify-center bg-white">

      {/* 실제 콘텐츠 영역 */}
      <div className="relative min-h-screen w-full bg-white">
        {isAuthenticated ? <AuthHeader /> : <UnAuthHeader />}

          <PageRouter />
        
      </div>
    </div>
    );
}


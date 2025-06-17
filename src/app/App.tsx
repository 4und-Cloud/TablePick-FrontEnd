import '@/app/App.css'
import PageRouter from '@/app/pageRouter'
import AuthHeader from '../@shared/components/Header/AuthHeader'
import UnAuthHeader from '../@shared/components/Header/UnAuthHeader'
import useAuth from '@/features/auth/hook/useAuth'

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


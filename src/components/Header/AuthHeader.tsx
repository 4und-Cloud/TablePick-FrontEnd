import logo from '@/assets/images/logo_nobg.png';
import search from '@/assets/images/magnifying-glass.png';
import alarmRing from '@/assets/images/alarmRing.png';
import RoundedBtn from '../Button/RoundedBtn';
import useModal from '../../hooks/useModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import SearchModal from '../Modal/SearchModal';

export default function AuthHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { isAuthenticated, user, logout } = useAuth();
  const searchModal = useModal({ initialState: false });

  const handleNavigateToAlarms = () => {
    navigate('/notifications');
  };

  const handleLogout = async () => {
    try {
      //FCM 토큰 삭제 API 호출
      if (user?.id) {
        const apiUrl = 'http://localhost:8080';
        await fetch(
          `${apiUrl}/api/notifications/fcm-token/remove?memberId=${user.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        console.log('FCM 토큰 삭제');
      }
      logout();
    } catch (error) {
      console.log('FCM 토큰 삭제 중 오류 : ', error);
      logout();
    }
  };

  return (
    <>
      <header className="py-4 sticky top-0 z-50 border-b flex justify-center border-main bg-white backdrop-blur">
        <div className="flex  gap-24 h-16 items-center justify-around">
          {/* logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-10">
            <Link
              to="/"
              className={`text-lg font-bold ${pathname === '/' ? 'text-main' : 'text-black'} transition-colors hover:text-main`}
            >
              홈
            </Link>
            <Link
              to="/restaurants"
              className={`text-lg font-bold ${pathname === '/restaurants' ? 'text-main' : 'text-black'} transition-colors hover:text-main`}
            >
              맛집 리스트
            </Link>
            <Link
              to="/posts"
              className={`text-lg font-bold ${pathname === '/posts' ? 'text-main' : 'text-black'} transition-colors hover:text-main`}
            >
              게시글
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/reservation-check"
                  className={`text-lg font-bold ${pathname === '/reservation-check' ? 'text-main' : 'text-black'} transition-colors hover:text-main`}
                >
                  예약 확인
                </Link>
                <Link
                  to="/my-posts"
                  className={`text-lg font-bold ${pathname === '/my-posts' ? 'text-main' : 'text-black'} transition-colors hover:text-main`}
                >
                  내 게시글
                </Link>
                <Link
                  to="/mypage"
                  className={`text-lg font-bold ${pathname === '/mypage' ? 'text-main' : 'text-black'} transition-colors hover:text-main`}
                >
                  마이페이지
                </Link>
              </>
            )}
          </nav>

          {/* 우측 영역 */}
          <div className="flex items-center gap-4">
            <button
              onClick={searchModal.openModal}
              type="button"
              className="text-muted-foreground hover:text-foreground"
            >
              <img
                src={search}
                alt="Search"
                className="w-[32px] h-[32px]"
              />
            </button>

            {isAuthenticated && (
              <button
                onClick={handleNavigateToAlarms}
                type="button"
                className="text-muted-foreground hover:text-foreground relative"
              >
                <img
                  src={alarmRing}
                  alt="Notifications"
                  className="w-[32px] h-[32px]"
                />
              </button>
            )}
            <>
              <div>
                <img
                  src={user.profileImage}
                  alt="프로필"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>

              <RoundedBtn
                onClick={handleLogout}
                text="Logout"
                bgColor="bg-main"
                textColor="text-white"
                hoverBorderColor="hover:border-main"
                hoverColor="hover:bg-white"
                hoverTextColor="hover:text-main"
              />
            </>
          </div>
        </div>
      </header>
      <SearchModal
        isOpen={searchModal.isOpen}
        onClose={searchModal.closeModal}
      />
    </>
  );
}

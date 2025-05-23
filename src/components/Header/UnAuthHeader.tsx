import logo from '@/assets/images/logo_nobg.png';
import search from '@/assets/images/magnifying-glass.png';
import {Link, useLocation} from 'react-router-dom';
import useModal from '../../hooks/useModal';
import RoundedBtn from '../Button/RoundedBtn';
import LoginModal from '../Modal/LoginModal';
import SearchModal from '../Modal/SearchModal';

export default function UnAuthHeader() {
    const location = useLocation();
    const pathname = location.pathname;
    const {isOpen, openModal, closeModal} = useModal({initialState: false});
    const searchModal = useModal({initialState: false});

    return (
        <>
            <header className="py-4 px-6 sticky top-0 z-50 w-full bg-white backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    {/* logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo || '/placeholder.svg'} alt="Logo" className="h-10"/>
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
                    </nav>

                    {/* 우측 영역 */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={searchModal.openModal}
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <img
                                src={search || '/placeholder.svg'}
                                alt="Search"
                                className="w-[32px] h-[32px]"
                            />
                        </button>
                        <RoundedBtn
                            onClick={openModal}
                            text="Login"
                            bgColor="bg-main"
                            textColor="text-white"
                            hoverBorderColor="hover:border-main"
                            hoverColor="hover:bg-white"
                            hoverTextColor="hover:text-main"
                        />
                    </div>
                </div>
            </header>
            <LoginModal isOpen={isOpen ?? false} onClose={closeModal}/>
            <SearchModal
                isOpen={searchModal.isOpen}
                onClose={searchModal.closeModal}
            />
        </>
    );
}

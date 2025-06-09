import logo from "@/assets/images/logo_nobg.png"
import search from "@/assets/images/magnifying-glass.png"
import RoundedBtn from "../Button/RoundedBtn"
import useModal from "../../hooks/useModal"
import LoginModal from "../Modal/LoginModal"
import { Link, useLocation } from "react-router-dom"
import SearchModal from "../Modal/SearchModal"

export default function UnAuthHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const { isOpen, openModal, closeModal } = useModal({ initialState: false });
  const searchModal = useModal({ initialState: false });

  return (
    <>
      <header className="py-4 sticky top-0 z-50 w-full border-b flex justify-center border-main bg-white backdrop-blur">
        <div className="container gap-32 flex h-16  items-center justify-around">
          {/* logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} height={40} width={120} alt="Logo" className="h-10" />
          </Link>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-16">
            <Link
              to="/"
              className={`text-lg font-bold ${pathname === "/" ? "text-main" : "text-black"} transition-colors hover:text-main`}
            >
              홈
            </Link>
            <Link
              to="/restaurants"
              className={`text-lg font-bold ${pathname === "/restaurants" ? "text-main" : "text-black"} transition-colors hover:text-main`}
            >
              맛집 리스트
            </Link>
            <Link
              to="/posts"
              className={`text-lg font-bold ${pathname === "/posts" ? "text-main" : "text-black"} transition-colors hover:text-main`}
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
              <img src={search} alt="Search" width={32} height={32} className="w-[32px] h-[32px]" />
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
      <LoginModal isOpen={isOpen ?? false} onClose={closeModal} />
      <SearchModal isOpen={searchModal.isOpen} onClose={searchModal.closeModal} />
    </>
  )
}
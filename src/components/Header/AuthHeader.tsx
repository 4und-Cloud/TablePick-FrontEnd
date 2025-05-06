import useAuth  from "../../hooks/useAuth";
import profile from '@/assets/images/profile_img.jpg';
import logo from '@/assets/images/logo_text.png';
import search from '@/assets/images/magnifying-glass.png';
<<<<<<< HEAD
import RoundedBtn from "../Button/RoundedBtn";
=======
>>>>>>> bacdb6f (feat : 로그인용 헤더, 비로그인용 헤더 컴포넌트 구현)

export default function AuthHeader() {
    const {logout} = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDd = () => {
        setIsOpen(prev => !prev);
    };

    return(
<<<<<<< HEAD
        <header className="fixed top-0 left-0 z-50 bg-main w-full h-[80px] flex items-center justify-between px-4 gap-4">
=======
        <header className="bg-bg-main w-full h-[80px] flex items-center justify-between px-4 gap-4">
>>>>>>> bacdb6f (feat : 로그인용 헤더, 비로그인용 헤더 컴포넌트 구현)
                    {/* logo */}
                    <div className="flex items-center">
                        <img src={logo} className='h-[40px]'/>
                    </div>
                    {/* 서치바 + 검색 버튼 */}
                    <div className="flex items-center gap-1">
                        <input 
                            type="text" 
                            placeholder="조용한 식당을 검색해보세요!"
                            className="px-4 py-2 rounded-md h-[40px] w-[750px]"/>
                        <button>
                            <img src={search} className="bg-white rounded-md w-[40px] h-[40px]"/>
                        </button>
                    </div>
                    {/* 프로필 + 로그아웃 버튼 */}
                    <div className="flex items-center gap-4">
                        <img src={profile} onClick={toggleDd}
                        className="w-[40px] h-[40px] rounded-full"/>
                        <RoundedBtn 
                            text="Logout" 
                            onClick={logout}
                             />
                    </div>
                    
                </header>
    )
};
import logo from '@/assets/images/logo_text.png'
import search from '@/assets/images/magnifying-glass.png'
import RoundedBtn from '../Button/RoundedBtn';
import useModal from '../../hooks/useModal';
import LoginModal from '../LoginModal';

export default function UnAuthHeader(){
    // const { login } = useAuth();
    const {isOpen, openModal, closeModal} = useModal({initialState : false});
    return(
        <>
            <header className="fixed top-0 z-50 bg-main w-[1200px] h-[80px] flex items-center justify-between px-6">
            {/* logo */}
            <div className="flex items-center">
                <img src={logo} className='h-[40px]'/>
            </div>
            {/* 서치바 + 검색 버튼 */}
            <div className="flex items-center gap-1">
                <input 
                    type="text" 
                    placeholder="조용한 식당을 검색해보세요!"
                    className="px-4 py-2 rounded-md h-[40px] w-[800px]"/>
                {/* 로그인 버튼 */}
                <button>
                    <img src={search} className="bg-white rounded-md w-[40px] h-[40px]"/>
                </button>
            </div>

            <RoundedBtn onClick={openModal} text = 'Login' />
        </header>
        <LoginModal isOpen={isOpen ?? false} onClose={closeModal} />
        </>
        
    )
}
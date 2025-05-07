import RoundedBtn from "../components/Button/RoundedBtn";
import Modal from "../components/Modal"
import useModal from "../hooks/useModal";

export default function Landing(){
    const {isOpen, closeModal, openModal} = useModal({initialState : false});

    const handleClose = () =>{
        closeModal();
    }
    return(
        <div className="pt-[90px]">
            <button onClick={openModal} className="border border-main">모달 열기 </button>
            {isOpen && (<Modal onClose={handleClose}
                footer = {
                    <RoundedBtn text='적용하기'
                    width="w-full"
                    borderColor="border-main" />
                }>
                <p className="ml-2 text-[24px]">필터</p>
            </Modal>)}
            <p>랜딩</p>
        </div>
        
    )
}
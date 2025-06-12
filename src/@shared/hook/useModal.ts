// 모달 상태 관리 훅

import {useState} from "react";

// 모달의 초기 상태가 꼭 닫혀있는 것은 아니기 때문에 초기 상태 추가
interface ModalProps {
    initialState?: boolean;
}

export default function useModal({initialState = false}: ModalProps = {}) {
    // 모달 열림/닫힘 관리
    const [isOpen, setIsOpen] = useState(initialState);

    // 모달 열림 함수
    const openModal = () =>{
        setIsOpen(true);
    };

    // 모달 닫힘 함수
    const closeModal = () => {
        setIsOpen(false);
    }

    return {
        isOpen, openModal, closeModal
    };
};

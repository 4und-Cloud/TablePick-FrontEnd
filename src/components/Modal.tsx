import ReactDOM from 'react-dom';

interface ModalProps{
    onClose: () => void;
    children: React.ReactNode;
    footer? : React.ReactNode; // 하단 버튼 자리
}

export default function Modal( {onClose, children, footer } : ModalProps) {
    return ReactDOM.createPortal(
        <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
            <div className='bg-white p-2 rounded-20 shadow-xl relative w-[540px] h-[540px] border-2 border-main flex flex-col justify-between'>
                <button className='absolute right-4 font-bold text-[20px] text-main' onClick={onClose}>X</button>
                {children}
                {footer && (
                <div className = 'p-4 flex jusify-end'>
                    {footer}
                </div>
            )}
            </div>
            
        </div>,
        document.getElementById('portal-root')! // container => 실제 DOM 위치를 의미
    );
}
import ReactDOM from 'react-dom';

interface ModalProps {
    onClose?: () => void;
    children: React.ReactNode;
    close? : React.ReactNode; // 닫기 버튼 자리
    footer? : React.ReactNode; // 하단 버튼 자리
    width? : string;
    height? : string;
    type? : string;
}

export default function Modal( { close, children, footer, width = '400px', height = '500px', type } : ModalProps) {

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div
                className="bg-white rounded-[12px] shadow-xl relative flex flex-col"
                style={{width, height}}
            >
                {/* 닫기 버튼 (조건부 렌더링) */}
                {close && (
                    <div className="absolute top-4 right-4">
                        {close}
                    </div>
                )}

                {/* 본문 내용 (스크롤 가능) */}
                <div className="flex-1 overflow-auto p-4">
                    {children}
                </div>

                {/* 푸터 버튼 (항상 하단 고정) */}
                {footer && (
                    <div className="p-4 flex justify-center">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.getElementById('portal-root')!
    );
}

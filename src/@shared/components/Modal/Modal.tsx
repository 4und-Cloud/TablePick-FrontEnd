import ReactDOM from 'react-dom';

interface ModalProps{
    onClose?: () => void;
    children: React.ReactNode;
    close? : React.ReactNode; // 닫기 버튼 자리
    footer? : React.ReactNode; // 하단 버튼 자리
    width? : string;
    height?: string;
    'data-cy'?: string;
}

export default function Modal( { close, children, footer, width = '400px', height = '500px', 'data-cy': modalDataCy } : ModalProps) {

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            data-cy={modalDataCy || "common-modal-overlay"}
        >
            <div
                className="bg-white rounded-[12px] shadow-xl relative flex flex-col"
                style={{ width, height }}
                data-cy={modalDataCy ? `${modalDataCy}-content` : "common-modal-content"}
            >
                {/* 닫기 버튼 (조건부 렌더링) */}
                {close && (
                    <div className="absolute top-4 right-4"
                        data-cy={modalDataCy ? `${modalDataCy}-close-wrapper` : "common-modal-close-wrapper"}
                    >
                        {close}
                    </div>
                )}

                {/* 본문 내용 (스크롤 가능) */}
                <div className="flex-1 overflow-auto p-4"
                    data-cy={modalDataCy ? `${modalDataCy}-body` : "common-modal-body"}
                >
                    {children}
                </div>

                {/* 푸터 버튼 (항상 하단 고정) */}
                {footer && (
                    <div className="p-4 flex justify-center"
                        data-cy={modalDataCy ? `${modalDataCy}-body` : "common-modal-body"}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.getElementById('portal-root')!
    );
}

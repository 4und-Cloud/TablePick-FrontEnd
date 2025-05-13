import { useState } from "react";
import Checkbox from "./Checkbox";
import Modal from "./Modal";
import RoundedBtn from "./Button/RoundedBtn";

interface FilterModalProps {
    mode? : 'filter' | 'tag';
    selectedTags : string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
    onClose : () => void;
    onClick? : () => void;
}

export default function FilterModal  ({mode = 'filter', selectedTags, setSelectedTags, onClose, onClick} : FilterModalProps) {
    const tabs = [
        ...(mode === 'filter' ? [{name : '음식 종류', id: 'foodType'}] : []),
        {name: '음식 / 가격', id: 'price'},
        {name : '분위기' , id : 'vibe'},
        {name : '기타', id:'etc'},
    ];

    const handleToggleTag = (tag: string) => {
        if (selectedTags.length < 5 || selectedTags.includes(tag)) {
            setSelectedTags((prev) =>
                prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
            );
        }
    };

    const handleRemoveTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <Modal onClose={onClose} close={<button onClick={onClose} className="text-main font-bold text-xl inset-0 z-50">X</button>} footer={
            <RoundedBtn
              text="적용하기"
              bgColor="bg-main"
              textColor="text-white"
              borderColor="border-main"
              hoverColor="hover:bg-white"
              hoverTextColor="hover:text-main"
              hoverBorderColor="hover:border-main"
              width="w-full"
              onClick={() => {onClick?.(); onClose();}}
            />
          }>
            <div className="m-3">
                <p className="text-main font-bold text-2xl mb-2">{mode === 'filter' ? '필터' : '태그 추가'}</p>

                {/* 탭 */}
                <div className="flex mb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`font-semibold p-2 w-full text-medium ${activeTab === tab.id ? 'bg-main text-white' : 'bg-gray-200'}`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                {selectedTags.length > 0 && (
                    <div className="mt-4 p-2">
                        <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                                <div
                                    key={tag}
                                    className="flex items-center bg-main rounded-lg px-2 py-1 text-medium font-semibold text-white"
                                >
                                    <span>{tag}</span>
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-red-500 font-semibold"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 태그 내용 */}
                <div className="space-y-4 mt-4 text-lg">
                    {activeTab === 'foodType' && (
                        <Checkbox tags={['일식', '중식', '한식']} selected={selectedTags} onToggle={handleToggleTag} />
                    )}
                    {activeTab === 'price' && (
                        <Checkbox tags={['가성비가 좋아요', '비싸요', '나쁘지 않은 가격']} selected={selectedTags} onToggle={handleToggleTag} />
                    )}
                    {activeTab === 'vibe' && (
                        <Checkbox tags={['조용해요', '시끄러워요', '작업하기 좋아요']} selected={selectedTags} onToggle={handleToggleTag} />
                    )}
                    {activeTab === 'etc' && (
                        <Checkbox tags={['주차하기 좋아요', '특별한 메뉴가 있어요', '주차장이 좁아요']} selected={selectedTags} onToggle={handleToggleTag} />
                    )}
                </div>

                
            </div>
        </Modal>
    );
}
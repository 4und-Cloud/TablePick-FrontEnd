import { useState } from "react";
import { useTagContext } from "../../../app/provider/TagContext";
import type { Tag } from "../../../app/provider/TagContext";
import search from '@/@shared/images/magnifying-glass.png'
import RoundedBtn from "../../../@shared/components/Button/RoundedBtn";
import Modal from "../../../@shared/components/Modal/Modal";
import { useNavigate } from "react-router-dom";

interface SearchModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentKeyword?: string; 
  currentTagIds?: number[]; 
}

export default function SearchModal({ isOpen, onClose, currentKeyword = '', currentTagIds = [] }: SearchModalProps) {
  const { tags: availableTags } = useTagContext();
  const [inputText, setInputText] = useState(currentKeyword);
  const [selectedItems, setSelectedItems] = useState<number[]>(currentTagIds);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleItemClick = (tagId: number) => {
    if (selectedItems.includes(tagId)) return;
    if (selectedItems.length >= 3) {
      alert('태그는 최대 3개 까지만 선택 가능합니다!');
      return;
    } 

    setSelectedItems((prev) => [...prev, tagId]);
  };

  const handleItemRemove = (tagId: number) => {
    setSelectedItems((prev) => prev.filter((id) => id !== tagId));
  };

  const handleSubmit = () => {
    const keyword = inputText.trim();
    const tagIds = selectedItems; 

    const newSearchParams = new URLSearchParams();
    if (keyword) {
      newSearchParams.set('keyword', keyword);
    }
    if (tagIds.length > 0) {
      newSearchParams.set('tagIds', tagIds.join(','));
    }
    newSearchParams.set('page','1');

    const targetUrl = `/restaurants?${newSearchParams.toString()}`;

    navigate(targetUrl);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleClose = () => {
    setInputText('');
    setSelectedItems([]);
    onClose();
  };


  return (
    <Modal
      width="900px"
      height="500px"
      onClose={onClose}
      close={
        <button onClick={handleClose} className="text-main font-bold text-xl inset-0 z-50">
          X
        </button>
      }
      footer={
        <RoundedBtn
          text="적용하기"
          bgColor="bg-main"
          textColor="text-white"
          borderColor="border-main"
          hoverColor="hover:bg-white"
          hoverTextColor="hover:text-main"
          hoverBorderColor="hover:border-main"
          width="w-full"
          onClick={handleSubmit}
        />
      }
    >
      <div className="space-y-6 px-4 py-2">
        <div>
          <p className="text-xl font-bold text-main">검색</p>
        </div>

        <div className="flex flex-wrap items-center border border-main rounded-full px-4 py-2 gap-2">
          {selectedItems.map((id) => {
            const tag = availableTags.find(t => t.id === id); 
            return tag ? ( 
              <div
                key={tag.id} 
                className="flex items-center bg-main text-white px-3 py-1 rounded-full text-sm"
              >
                {tag.name} 
                <button onClick={() => handleItemRemove(tag.id)} className="ml-2">✕</button>
              </div>
            ) : null;
          })}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력하세요"
            className="flex-grow min-w-[120px] outline-none text-base"
          />
          <button type="button" onClick={handleSubmit}>
            <img width={24} height={24} src={search} alt="검색" className="w-6 h-6" />
          </button>
        </div>

        <div>
          <p className="text-md font-semibold text-gray-700">카테고리 (최대 3개 선택 가능)</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTags.map((tag: Tag) => (
              <button
                key={tag.id}
                
                onClick={() => handleItemClick(tag.id)}
                className={`border px-3 py-1 rounded-full text-sm transition ${
                  selectedItems.includes(tag.id) 
                    ? 'bg-main text-white border-main'
                    : 'border-main text-main hover:bg-main hover:text-white'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

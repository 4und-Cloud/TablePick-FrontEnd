import { useState } from "react";
import { useTagContext } from "../../store/TagContext";
import { Tag } from "../../store/TagContext";
import search from '@/assets/images/magnifying-glass.png';
import RoundedBtn from "../Button/RoundedBtn";
import Modal from "./Modal";
import { Category, useCategoryContext } from "../../store/CategoryContext";

interface SearchModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onClick?: (combinedKeyword: string) => void;
}

export default function SearchModal({ isOpen, onClose, onClick }: SearchModalProps) {
  const { tags } = useTagContext();
  const { category } = useCategoryContext();
  const [inputText, setInputText] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleItemClick = (item: string) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const handleItemRemove = (item: string) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  };

  const handleSubmit = () => {
    const combined = [...selectedItems, inputText.trim()].filter(Boolean).join(' ');
    onClick?.(combined);
    onClose();
  };

  return (
    <Modal
      width="1000px"
      height="900px"
      onClose={onClose}
      close={
        <button onClick={onClose} className="text-main font-bold text-xl inset-0 z-50">
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
        {/* 헤더 */}
        <div>
          <p className="text-xl font-bold text-main">검색</p>
        </div>

        {/* 서치바 */}
        <div className="flex flex-wrap items-center border border-main rounded-full px-4 py-2 gap-2">
          {selectedItems.map((item) => (
            <div
              key={item}
              className="flex items-center bg-main text-white px-3 py-1 rounded-full text-sm"
            >
              {item}
              <button onClick={() => handleItemRemove(item)} className="ml-2">✕</button>
            </div>
          ))}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-grow min-w-[120px] outline-none text-base"
          />
          <button type="button" onClick={handleSubmit}>
            <img src={search} alt="검색" className="w-6 h-6" />
          </button>
        </div>

        {/* 음식 종류 */}
        <div>
          <p className="text-md font-semibold text-gray-700">음식 종류</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {category.map((category: Category) => (
              <button
                key={category.id}
                onClick={() => handleItemClick(category.name)}
                className={`border px-3 py-1 rounded-full text-sm transition ${
                  selectedItems.includes(category.name)
                    ? 'bg-main text-white border-main'
                    : 'border-main text-main hover:bg-main hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <p className="text-md font-semibold text-gray-700">카테고리</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: Tag) => (
              <button
                key={tag.id}
                onClick={() => handleItemClick(tag.name)}
                className={`border px-3 py-1 rounded-full text-sm transition ${
                  selectedItems.includes(tag.name)
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

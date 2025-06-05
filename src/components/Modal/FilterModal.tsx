import { useTagContext } from "../../store/TagContext";
import Modal from "./Modal";
import RoundedBtn from "../Button/RoundedBtn";

interface FilterModalProps {
  isOpen? : boolean;
  selectedTags: number[];
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
  onClose: () => void;
  onClick?: () => void;
}

export default function FilterModal({
  isOpen,
  selectedTags,
  setSelectedTags,
  onClose,
  onClick,
}: FilterModalProps) {
  if (!isOpen) return false
  const { tags } = useTagContext();

  const handleToggleTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags((prev) => prev.filter((id) => id !== tagId));
    } else if (selectedTags.length < 5) {
      setSelectedTags((prev) => [...prev, tagId]);
    }
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId));
  };

  return (
    <Modal
      onClose={onClose}
      close={
        <button
    onClick={(e) => {
      e.stopPropagation();
      onClose();
    }}
    className="text-main font-bold text-xl absolute top-2 right-2"
  >
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
          onClick={() => {
            onClick?.();
            onClose();
          }}
        />
      }
    >
      <div className="m-3">
        <p className="text-main font-bold text-2xl mb-4">카테고리 선택</p>

        {/* 선택된 태그 표시 */}
        {selectedTags.length > 0 && (
          <div className="mb-4 p-2 border border-gray-200 rounded-md">
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((id) => {
                const tag = tags.find((t) => t.id === id);
                return (
                  tag && (
                    <div
                      key={tag.id}
                      className="flex items-center bg-main rounded-lg px-2 py-1 text-sm font-medium text-white"
                    >
                      <span>{tag.name}</span>
                      <button
                        onClick={() => handleRemoveTag(tag.id)}
                        className="ml-2 text-white font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        )}

        {/* 태그 리스트 */}
        <div className="space-y-2">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={() => handleToggleTag(tag.id)}
                disabled={
                  !selectedTags.includes(tag.id) && selectedTags.length >= 5
                }
              />
              <span className="text-gray-800 font-medium">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}
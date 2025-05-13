import { useState } from "react";
import Modal from "./Modal"; // Modal 컴포넌트 임포트
import RoundedBtn from "./Button/RoundedBtn"; // 버튼 컴포넌트 임포트
import FilterModal from "../components/FilterModal"; // FilterModal 임포트
import useModal from "../hooks/useModal"; // useModal 훅 임포트

interface PostWriteModalProps {
  closeModal: () => void; // 모달을 닫는 함수
}

export function PostWriteModal({ closeModal }: PostWriteModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { isOpen, openModal, closeModal: closeFilterModal } = useModal({ initialState: false });

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleTagAdd = () => {
    closeFilterModal();
  };

  return (
    <Modal
      width="600px"
      height="auto"
      close={
        <button
          onClick={closeModal}
          className="text-main font-bold text-xl absolute top-2 right-2"
        >
          X
        </button>
      }
      footer={
        <RoundedBtn
          text="등록"
          onClick={() => {}}
          bgColor="bg-main"
          textColor="text-white"
          borderColor="border-main"
          hoverColor="hover:bg-white"
          hoverTextColor="hover:text-main"
          hoverBorderColor="hover:border-main"
          width="w-full"
        />
      }
    >
      <div className="grid gap-4 py-2">
        {/* 식당명 입력 */}
        <div className="space-y-1.5">
          <label htmlFor="restaurant" className="text-sm font-medium">
            식당명
          </label>
          <input
            id="restaurant"
            placeholder="식당 이름을 입력하세요"
            className="border-[#f1815c]/20 focus:border-[#f1815c] focus:ring-[#f1815c]/20 w-full p-2 rounded-md"
            defaultValue="제주 흑돼지 맛집"
          />
        </div>

        {/* 내용 입력 */}
        <div className="space-y-1.5">
          <label htmlFor="content" className="text-sm font-medium">
            내용
          </label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            className="h-24 min-h-0 border-[#f1815c]/20 focus:border-[#f1815c] focus:ring-[#f1815c]/20 w-full p-2 rounded-md"
            defaultValue="지난 주말 제주도 여행 중 방문한 맛집입니다. 흑돼지 바비큐가 정말 맛있었고, 서비스도 좋았습니다. 가격은 조금 있지만 맛과 분위기를 생각하면 충분히 가치 있었습니다."
          />
        </div>

        {/* 태그 선택 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">태그 선택 (최대 5개)</label>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="cursor-pointer text-xs py-1 px-3 rounded-full bg-[#f1815c] text-white"
              >
                {tag}
              </span>
            ))}
            {selectedTags.length < 5 && (
              <button
                type="button"
                onClick={openModal}
                className="cursor-pointer text-xs py-1 px-3 rounded-full bg-background hover:bg-[#f1815c]/10 border-[#f1815c]/30 text-foreground"
              >
                태그 추가
              </button>
            )}
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">이미지</label>
          <div className="grid grid-cols-3 gap-2 mt-1.5">
            {/* 이미지 미리보기 1 */}
            <div className="relative group rounded-md overflow-hidden border border-[#f1815c]/20">
              <img
                src="/placeholder.svg?height=80&width=80&text=음식+1"
                alt="첨부 이미지 1"
                className="w-full h-16 object-cover"
              />
              <button
                type="button"
                className="absolute top-0.5 right-0.5 bg-white/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-[#f1815c] text-xs">X</span>
              </button>
            </div>

            {/* 이미지 미리보기 2 */}
            <div className="relative group rounded-md overflow-hidden border border-[#f1815c]/20">
              <img
                src="/placeholder.svg?height=80&width=80&text=음식+2"
                alt="첨부 이미지 2"
                className="w-full h-16 object-cover"
              />
              <button
                type="button"
                className="absolute top-0.5 right-0.5 bg-white/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-[#f1815c] text-xs">X</span>
              </button>
            </div>

            {/* 이미지 추가 버튼 */}
            <button
              type="button"
              className="h-16 border-2 border-dashed border-[#f1815c]/30 rounded-md flex flex-col items-center justify-center text-[#f1815c]/70 hover:bg-[#f1815c]/5 transition-colors"
            >
              <span className="text-xs">추가</span>
            </button>
          </div>
        </div>
      </div>

      {/* 필터 모달 */}
      {isOpen && (
        <FilterModal
          mode="tag"
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          onClick={handleTagAdd}
          onClose={closeFilterModal}
        />
      )}
    </Modal>
  );
}

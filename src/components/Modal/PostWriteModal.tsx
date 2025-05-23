import {useEffect, useState} from "react";
import Modal from "./Modal";
import RoundedBtn from "../Button/RoundedBtn";
import FilterModal from "./FilterModal";
import useModal from "../../hooks/useModal";

interface PostWriteModalProps {
    closeModal: () => void;
    initialData?: {
        restaurant: string;
        content: string;
        selectedTags: string[];
    }; // 수정 모드일 때 사용될 초기 데이터
}

export function PostWriteModal({closeModal, initialData}: PostWriteModalProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.selectedTags || []);
    const [restaurant, setRestaurant] = useState<string>(initialData?.restaurant || "");
    const [content, setContent] = useState<string>(initialData?.content || "");

    const {isOpen, openModal, closeModal: closeFilterModal} = useModal({initialState: false});

    useEffect(() => {
        if (initialData) {
            setRestaurant(initialData.restaurant);
            setContent(initialData.content);
            setSelectedTags(initialData.selectedTags);
        }
    }, [initialData]);

    // const handleTagToggle = (tag: string) => {
    //   if (selectedTags.includes(tag)) {
    //     setSelectedTags(selectedTags.filter((t) => t !== tag));
    //   } else {
    //     if (selectedTags.length < 5) {
    //       setSelectedTags([...selectedTags, tag]);
    //     }
    //   }
    // };

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
                    text={initialData ? "수정" : "등록"}
                    onClick={() => {
                    }}
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
                        value={restaurant}
                        onChange={(e) => setRestaurant(e.target.value)}
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
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
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

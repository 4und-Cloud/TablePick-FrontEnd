<<<<<<< HEAD:src/components/Modal/PostWriteModal.tsx
import {useEffect, useState} from "react";
import Modal from "./Modal";
import RoundedBtn from "../Button/RoundedBtn";
import FilterModal from "./FilterModal";
import useModal from "../../hooks/useModal";
import { useTagContext } from "../../store/TagContext";
import api from "../../lib/api";
=======
import { useState, useEffect } from "react";
import Modal from "../../../@shared/components/Modal/Modal";
import RoundedBtn from "../../../@shared/components/Button/RoundedBtn";
import FilterModal from "../../../@shared/components/Modal/FilterModal";
import useModal from "../../../@shared/hook/useModal";
import { useTagContext } from "../../../app/provider/TagContext";
import { fetchCreatePost } from "@/entities/post/api/fetchPosts";

interface PostWriteModalProps {
  closeModal: () => void;
  reservationId: number | null;
  initialData?: {
    restaurant: string;
    content: string;
    selectedTagIds?: number[]; 
  };
}

export function PostWriteModal({ closeModal, reservationId, initialData }: PostWriteModalProps) {
  const [selectedTags, setSelectedTags] = useState<number[]>(initialData?.selectedTagIds || []);
  const [restaurant, setRestaurant] = useState<string>(initialData?.restaurant || "");
  const [content, setContent] = useState<string>(initialData?.content || "");
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const { isOpen, openModal, closeModal: closeFilterModal } = useModal({ initialState: false });

  useEffect(() => {
    if (initialData) {
      setRestaurant(initialData.restaurant);
      setContent(initialData.content);
      setSelectedTags(initialData.selectedTagIds || []); 
    } else {
      setRestaurant("");
      setContent("");
      setSelectedTags([]); 
      setSelectedImageFiles([]);
      setImagePreviews([]);
    }
  }, [initialData]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newFiles = [...selectedImageFiles, ...files].slice(0, 3);
      setSelectedImageFiles(newFiles);

      const newPreviews: string[] = [];
      newFiles.forEach(file => {
        newPreviews.push(URL.createObjectURL(file));
      });
      setImagePreviews(newPreviews);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedFiles = selectedImageFiles.filter((_, index) => index !== indexToRemove);
    setSelectedImageFiles(updatedFiles);
    const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    setImagePreviews(updatedPreviews);
  };

  const handlePostSubmit = async () => {
    if (reservationId === null || reservationId === undefined) {
      alert("게시글을 작성할 예약 정보를 선택해주세요.");
      console.error("reservationId가 null이거나 undefined입니다.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (selectedTags.length === 0) {
      alert("태그는 최소 1개 이상 선택해야 합니다.");
      return;
    }

    const formData = new FormData();

    formData.append('reservationId', reservationId.toString());
    formData.append('content', content);

    if (selectedTags.length > 0) {
      const tagIds = selectedTags.join(','); 
      formData.append('tagId', tagIds);
    }

    selectedImageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await fetchCreatePost(formData);
      alert('게시글이 성공적으로 작성되었습니다!');
      closeModal();
    } catch (error: any) {
      console.error('게시글 작성 중 오류 발생:', error);
      // 401 에러는 인터셉터에서 처리하므로, 여기서는 일반적인 에러 메시지만 표시
      const message = error.response?.data?.message || '게시글 작성에 실패했습니다.';
      alert(message);
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
          X
        </button>
      }
      footer={
        <RoundedBtn
          text='등록'
          onClick={handlePostSubmit}
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
        <div className="space-y-1.5">
          <label htmlFor="restaurant" className="text-sm font-medium">
            식당명
          </label>
          <input
            id="restaurant"
            placeholder="식당 이름을 입력하세요"
            className="border-[#f1815c]/20 focus:border-[#f1815c] focus:ring-[#f1815c]/20 w-full p-2 rounded-md bg-gray-100"
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            disabled
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="content" className="text-sm font-medium">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            className="h-24 min-h-0 border-[#f1815c]/20 focus:border-[#f1815c] focus:ring-[#f1815c]/20 w-full p-2 rounded-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* 태그 선택 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">태그 선택 (최대 5개)</label>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {selectedTags.map((tagId) => {
              
              const { tagsItem: allAvailableTags } = useTagContext(); // Assuming TagContext is available
              const currentTag = allAvailableTags.find(t => t.id === tagId);
              return (
                <span
                  key={tagId}
                  className="cursor-pointer text-xs py-1 px-3 rounded-full bg-[#f1815c] text-white"
                  onClick={() => setSelectedTags(prev => prev.filter(id => id !== tagId))} // ID로 제거
                >
                  {currentTag ? currentTag.name : `Tag ${tagId}`} X
                </span>
              );
            })}
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
          <label className="text-sm font-medium">이미지 (최대 3개)</label>
          <div className="grid grid-cols-3 gap-2 mt-1.5">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group rounded-md overflow-hidden border border-[#f1815c]/20">
                <img
                  src={preview}
                  alt={`첨부 이미지 ${index + 1}`}
                  className="w-full h-16 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0.5 right-0.5 bg-white/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-[#f1815c] text-xs">X</span>
                </button>
              </div>
            ))}
            {selectedImageFiles.length < 3 && (
              <label
                htmlFor="image-upload"
                className="h-16 border-2 border-dashed border-[#f1815c]/30 rounded-md flex flex-col items-center justify-center text-[#f1815c]/70 hover:bg-[#f1815c]/5 transition-colors cursor-pointer"
              >
                <span className="text-xs">추가</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <FilterModal
          isOpen={isOpen}
          selectedTags={selectedTags} 
          setSelectedTags={setSelectedTags} 
          onClose={closeFilterModal}
        />
      )}
    </Modal>
  );
}

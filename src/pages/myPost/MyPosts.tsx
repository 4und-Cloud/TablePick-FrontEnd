import { CardItemProps } from "@/@shared/types/cardItemsType";
import List from "../../@shared/components/List";
import { useEffect, useState } from "react";
import { fetchDeletePost } from "@/entities/post/api/fetchPosts";
import { fetchMypost } from "@/entities/post/api/fetchMypost";

export default function MyPosts() {
  const [post, setPost] = useState<CardItemProps[]>([]);


  useEffect(() => {
    loadMypost();
  }, []);

  const handleDeletePost = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await fetchDeletePost(id);
        alert('게시글이 성공적으로 삭제되었습니다.');
        loadMypost();
      } catch (error: any) {
        console.error('삭제 중 오류:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
        });
        alert(
          `게시글 삭제 실패: ${error.response?.data?.message || error.message || '서버와 연결할 수 없습니다.'
          }`
        );
      }
    }
  };
  
    const loadMypost = async () => {
      try {
        const formattedPosts = await fetchMypost();
        setPost(formattedPosts);
      } catch (error) {
        console.log('로드 실패 : ', error);
        alert('게시글을 불러오지 못했습니다. 다시 시도해주세요');
      }
    };
  
  useEffect(() => {
    loadMypost();
  }, []);

  return (
      <div className="m-4">
        <div>
          {post.length > 0 ? (
            <List onDelete={handleDeletePost} items={post} />
          ) : (
            <p className="text-center text-gray-500 mt-10">게시글 내역이 없습니다.</p>
          )}
  
          <div>
          </div>
        </div>
        
      </div>
    );
  }

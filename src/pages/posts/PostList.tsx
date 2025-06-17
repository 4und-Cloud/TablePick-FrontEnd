import { CardItemProps } from "@/@shared/types/cardItemsType";
import React, { useEffect, useState, Suspense, useRef, useCallback } from "react";
import defaultProfile from "@/@shared/images/user.png";
import { useSearchParams } from "react-router-dom";
import { fetchPosts, convertedPostListData } from "@/entities/post/api/fetchPosts";
import { FetchPostsParams } from "@/entities/post/types/postType";
import useIntersectionObserver from "@/@shared/hook/useIntersectionObserver";

const LazyList = React.lazy(() => import('@/@shared/components/List'));

export default function PostList() {
  const [postList, setPostList] = useState<CardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  const getCurrentSearchParams = useCallback(() => {
    const restaurantIdParam = searchParams.get('restaurantId');
    const restaurantId = restaurantIdParam ? Number(restaurantIdParam) : null;
    return { restaurantId };
  }, [searchParams]);

  const [selectedTags] = useState<string[]>([]);

  const tagElements = selectedTags.map((tag, index) => (
    <span key={index} className="bg-main text-white py-1 px-4 rounded-full mr-2">{tag}</span>
  ));

  const fetchData = useCallback(
    async (fetchPage: number, restaurantId: number | null, isInitialLoad: boolean) => {
      if (isFetching.current) {
        return;
      }

      isFetching.current = true;
      setLoading(true);
      
      try {
        const params: FetchPostsParams = {
          restaurantId, page: fetchPage, size: 6
        };

        const { data: posts, totalPages } = await fetchPosts(params);
        const convertedData = convertedPostListData(posts, defaultProfile);

        setPostList((prev) => {
          if (isInitialLoad) {
            return convertedData;
          } else {
            const newPosts = convertedData.filter(newItem => !prev.some(existingItem => existingItem.id === newItem.id));
            return [...prev, ...newPosts]
          }
        });

        setHasMore(fetchPage < totalPages);
      } catch (error) {
        setPostList([]);
        setHasMore(false);
        alert('게시글을 불러오지 못했습니다. 다시 시도해주세요.');
      } finally {
        isFetching.current = false;
        setLoading(false);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    setPage(0);
    setPostList([]);
    setHasMore(true);
    setLoading(true);
    isFetching.current = false;

    const { restaurantId } = getCurrentSearchParams();
    fetchData(0, restaurantId, true);
  }, [searchParams, getCurrentSearchParams]);

  useEffect(() => {
    if (page === 0 && !isFetching.current) {
      return;
    }

    const { restaurantId } = getCurrentSearchParams();
    fetchData(page, restaurantId, false);
  }, [page, getCurrentSearchParams, fetchData]);

  const onIntersect = useCallback(() => {
    if (!loading && hasMore && !isFetching.current) {
      setPage((p) => {
        return p + 1;
      });
    }
  }, [loading, hasMore]);

  const sentinelRef = useIntersectionObserver(onIntersect);

  return (
    <div>
      <div className="flex justify-between mx-6 my-2 flex-row">
        <div className="flex overflow-x-auto items-center justify-center">{tagElements}</div>
      </div>

      <div>
        {(loading && postList.length === 0 && page === 0) ? (
          <p className="text-center my-10">불러오는 중...</p>
        ) : (
          <>
            {postList.length === 0 && !loading && !hasMore ? (
              <p className="text-center my-10 text-gray-500">게시글이 없습니다.</p>
              ) : (
                    <Suspense fallback>
                <LazyList  items={postList} />
              </Suspense>
              )}

              {hasMore && (
                <div ref={sentinelRef}>
                  {loading ? (
                    <p className="text-center my-4 text-gray-500">더 많은 게시글을 불러오는 중...</p>
                  ) : (
                      <div className="w-full h-full" />
                  )}
                </div>
              )}

              {hasMore && postList.length > 0 && (
                <p className="text-center my-4 text-gray-500">모든 게시글을 불러왔습니다.</p>
              )}
              
          </>
        )}
      </div>
    </div>
  );
}
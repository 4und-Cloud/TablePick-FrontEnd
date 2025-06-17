import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "../api/fetchCategory";

export const useCategoryQuery = () => {
    return useQuery({
        queryKey: ['category'],
        queryFn: fetchCategory,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};
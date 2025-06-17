import { useQuery } from "@tanstack/react-query";
import { fetchTag } from "../api/fetchTag";

export const useTagQuery = () => {
    return useQuery({
        queryKey: ['tag'],
        queryFn: fetchTag,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};
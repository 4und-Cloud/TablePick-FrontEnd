import api from "@/@shared/api/api";
import { TagProps } from "../types/tagType";

export const fetchTag = async(): Promise<TagProps[]> => {
    const { data } = await api.get('/api/tags');
    return data;
}
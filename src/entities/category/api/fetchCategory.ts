import api from "@/@shared/api/api";
import { CategoryProps } from "../types/categoryType";

export const fetchCategory = async (): Promise<CategoryProps[]> => {
    const { data } = await api.get('/api/category');
    return data;
}
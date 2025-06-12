import api from "@/@shared/api/api";

export interface CategoryProps {
    id: number;
    name: string;
}

export const fetchCategory = async (): Promise<CategoryProps[]> => {
    const { data } = await api.get('/api/category');
    return data;
}
import api from "@/@shared/api/api";

export interface TagProps {
    id: number;
    name: string;
}

export const fetchTag = async(): Promise<TagProps[]> => {
    const { data } = await api.get('/api/tags');
    return data;
}
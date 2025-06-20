import api from "@/@shared/api/api"; 
import { RestaurantLandingData, RestaurantListData } from "../types/restaurantType";

export const fetchRestaurantsLanding = async (): Promise<RestaurantLandingData[]> => {
  const response = await api.get(`/api/restaurants/all`);
  const restaurantsData = response.data.content;
  return Array.isArray(restaurantsData) ? restaurantsData : [];
};

export const fetchRestaurantsList = async (
  currentPage: number,
  keyword: string = '',
  tagIds: number[] = [],
  onlyOperating: boolean = false,
  sort: string=''
): Promise<{ restaurants: RestaurantListData[]; totalPages: number }> => {
  const queryParams: string[] = [];
  queryParams.push(`page=${currentPage}`);
  queryParams.push('size=6');

  if (keyword) queryParams.push(`keyword=${encodeURIComponent(keyword.trim().toLowerCase())}`);
  if (tagIds.length) queryParams.push(`tagIds=${tagIds.join(',')}`);
  if (onlyOperating) queryParams.push(`onlyOperating=${onlyOperating}`);
  if (sort) queryParams.push(`sort=${sort}`);

  const url = `/api/restaurants/v1/search?${queryParams.join('&')}`;

  const { data } = await api.get(url);

  return {
    restaurants: (data.content ?? []).map((item: any) => ({
      ...item,
      restaurantImage: item.restaurantImage ? item.restaurantImage : null,
      restaurantTags: item.restaurantTags || [],
      restaurantCategory: typeof item.restaurantCategory === "string" ? item.restaurantCategory : item.restaurantCategory?.name || "기타",
    })),
    totalPages: data.totalPages ?? 1,
  };
};

export const fetchRestaurantDetail = async (id: string | number) => {
  try {
    const response = await api.get(`/api/restaurants/${id}`);
    const data = response.data;

    let processedRestaurantImage: { imageUrl: string } | null = null;
    if (typeof data.restaurantImage === 'string') {
      processedRestaurantImage = { imageUrl: data.restaurantImage };
    } else if (data.restaurantImage && typeof data.restaurantImage === 'object' && 'imageUrl' in data.restaurantImage) {
      processedRestaurantImage = data.restaurantImage;
    }

    return {
      ...data,
      restaurantImage: processedRestaurantImage,
      restaurantTags: data.restaurantTags || [],
      restaurantOperatingHours: data.restaurantOperatingHours || [],
      menus: data.menus || [],
    };
  } catch (error) {
    throw new Error('식당 데이터 불러오지 못함');
  }
}
  








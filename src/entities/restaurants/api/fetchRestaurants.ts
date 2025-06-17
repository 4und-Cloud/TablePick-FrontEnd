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
  tagIds: number[] = []
): Promise<{ restaurants: RestaurantListData[]; totalPages: number }> => {
  const queryParams: string[] = [];
  queryParams.push(`page=${currentPage}`);
  queryParams.push('size=6');

  let url = (keyword || tagIds.length)
    ? "/api/restaurants/search"
    : "/api/restaurants/list";

  if (keyword)  queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
  if (tagIds.length) queryParams.push(`tagIds=${tagIds.join(",")}`);

  url += `?${queryParams.join("&")}`;

  const { data } = await api.get(url);

  return {
    restaurants: data.restaurants ?? [],
    totalPages: data.totalPages ?? 1,
  };
};

export const fetchRestaurantDetail = async (id: string | number) => {
    const response = await api.get(`/api/restaurants/${id}`);
    return response.data;
}
  








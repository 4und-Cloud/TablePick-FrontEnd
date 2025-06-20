export interface RestaurantLandingData {
  id: number;
  name: string;
  address: string;
  categoryName: string;
  restaurantTags: string[];
  imageUrl: string;
};

export interface RestaurantListData {
  id: number;
  name: string;
  address: string;
  restaurantPhoneNumber: string;
  restaurantCategory: string | { id: number; name: string }; 
  restaurantImage: string | null; 
  restaurantTags: string[] | null;
}

export interface RestaurantDetailData {
  id: number;
  name: string;
  address: string;
  restaurantPhoneNumber: string;
  restaurantCategory: {
    id: number;
    name: string;
  };
  restaurantImage: { imageUrl: string } | null;
  restaurantOperatingHours: Array<{
    dayOfWeek: string;
    openTime: string | null;
    closeTime: string | null;
    holiday: boolean;
  }>;
  restaurantTags: string[];
  menus: { name: string; price: number }[];
  xcoordinate: number;
  ycoordinate: number;
};
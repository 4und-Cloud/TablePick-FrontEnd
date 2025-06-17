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
  restaurantCategory: {
    id: number;
    name: string;
  };
  restaurantImage: string;
  restaurantOperatingHours: Array<{
    dayOfWeek: string;
    openTime: string | null;
    closeTime: string | null;
    holiday: boolean;
  }>;
  restaurantTags: string[];
};
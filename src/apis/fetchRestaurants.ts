// import axios from "axios";

// export interface RestaurantData {
//     id: number;
//     image: string;
//     restaurantName : string;
//     description: string;
//     tags: string[];
// }

// export const fetchRestaurants = async(token : string) : Promise<RestaurantData[]> => {
//     const response = await axios.get(`${import.meta.env.VITE_TABLE_PICK_URL}/api/restaurants/list`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//     });

//     return response.data;
// }
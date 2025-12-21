
export type Category = string;

export const CATEGORIES = {
  APPETIZERS: 'Appetizers',
  ENTREES: 'Entrees',
  VEGETARIAN: 'Vegetarian',
  DESSERTS: 'Desserts',
  BEVERAGES: 'Beverages'
} as const;

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  isPopular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface SiteSettings {
  name: string;
  address: string;
  phone: string;
  hours: {
    weekdays: string;
    weekends: string;
  };
}

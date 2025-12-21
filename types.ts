
export enum Category {
  APPETIZERS = 'Appetizers',
  ENTREES = 'Entrees',
  VEGETARIAN = 'Vegetarian',
  DESSERTS = 'Desserts',
  BEVERAGES = 'Beverages'
}

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

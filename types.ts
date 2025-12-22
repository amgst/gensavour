
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

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  items: CartItem[];
  timestamp: string;
  type: 'pickup' | 'delivery';
  address?: string;
  phone: string;
  email: string;
  notes?: string;
}

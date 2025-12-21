
import { Category, MenuItem } from './types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Mantu',
    description: 'Traditional steamed dumplings filled with spiced ground beef and onions, topped with split pea tomato sauce and garlic yogurt.',
    price: 12.95,
    category: Category.APPETIZERS,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?q=80&w=2070&auto=format&fit=crop',
    isPopular: true
  },
  {
    id: '2',
    name: 'Bolani',
    description: 'Pan-fried flatbread stuffed with leeks and potatoes, served with yogurt dipping sauce.',
    price: 9.95,
    category: Category.APPETIZERS,
    image: 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Kabuli Palow',
    description: 'Our signature national dish. Tender lamb shank buried under seasoned rice topped with caramelized carrots and raisins.',
    price: 24.95,
    category: Category.ENTREES,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop',
    isPopular: true
  },
  {
    id: '4',
    name: 'Lamb Chops',
    description: 'Succulent lamb chops marinated in signature spices and charbroiled to perfection.',
    price: 28.95,
    category: Category.ENTREES,
    image: 'https://images.unsplash.com/photo-1602491673980-73aa38de027a?q=80&w=1970&auto=format&fit=crop',
    isPopular: true
  },
  {
    id: '5',
    name: 'Borani Banjan',
    description: 'Sauteed eggplant topped with a zesty tomato sauce and garlic yogurt.',
    price: 18.95,
    category: Category.VEGETARIAN,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=1933&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Firnee',
    description: 'Traditional milk pudding flavored with rosewater, cardamom, and garnished with pistachios.',
    price: 7.95,
    category: Category.DESSERTS,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28be0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Afghan Dogh',
    description: 'Refreshing homemade yogurt drink mixed with diced cucumbers and dried mint.',
    price: 4.50,
    category: Category.BEVERAGES,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Green Tea with Cardamom',
    description: 'Traditional Afghan tea infused with aromatic cardamom pods.',
    price: 3.95,
    category: Category.BEVERAGES,
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=2070&auto=format&fit=crop'
  }
];

export const SITE_INFO = {
  name: 'GENSAVOR',
  subName: 'Generative Flavor Intelligence',
  address: '3200 W Victory Blvd, Burbank, CA 91505',
  phone: '(818) 555-0123',
  hours: {
    weekdays: '11:00 AM - 9:30 PM',
    weekends: '12:00 PM - 10:30 PM'
  }
};

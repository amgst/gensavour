

import { MenuItem, CATEGORIES } from './types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Mantu',
    description: 'Traditional steamed dumplings filled with spiced ground beef and onions, topped with split pea tomato sauce and garlic yogurt.',
    price: 12.95,
    category: CATEGORIES.APPETIZERS,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?q=80&w=2070&auto=format&fit=crop',
    isPopular: true
  },
  {
    id: '2',
    name: 'Bolani',
    description: 'Pan-fried flatbread stuffed with leeks and potatoes, served with yogurt dipping sauce.',
    price: 9.95,
    category: CATEGORIES.APPETIZERS,
    image: 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Kabuli Palow',
    description: 'Our signature national dish. Tender lamb shank buried under seasoned rice topped with caramelized carrots and raisins.',
    price: 24.95,
    category: CATEGORIES.ENTREES,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop',
    isPopular: true
  },
  {
    id: '4',
    name: 'Lamb Chops',
    description: 'Succulent lamb chops marinated in signature spices and charbroiled to perfection.',
    price: 28.95,
    category: CATEGORIES.ENTREES,
    image: 'https://images.unsplash.com/photo-1602491673980-73aa38de027a?q=80&w=1970&auto=format&fit=crop',
    isPopular: true
  },
  {
    id: '5',
    name: 'Borani Banjan',
    description: 'Sauteed eggplant topped with a zesty tomato sauce and garlic yogurt.',
    price: 18.95,
    category: CATEGORIES.VEGETARIAN,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=1933&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Firnee',
    description: 'Traditional milk pudding flavored with rosewater, cardamom, and garnished with pistachios.',
    price: 7.95,
    category: CATEGORIES.DESSERTS,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28be0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Afghan Dogh',
    description: 'Refreshing homemade yogurt drink mixed with diced cucumbers and dried mint.',
    price: 4.50,
    category: CATEGORIES.BEVERAGES,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Green Tea with Cardamom',
    description: 'Traditional Afghan tea infused with aromatic cardamom pods.',
    price: 3.95,
    category: CATEGORIES.BEVERAGES,
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '9',
    name: 'Sambosa',
    description: 'Crispy fried pastries filled with spiced potatoes and peas.',
    price: 7.95,
    category: CATEGORIES.APPETIZERS,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: '10',
    name: 'Pakawra',
    description: 'Batter-fried potato slices served with chutney.',
    price: 8.95,
    category: CATEGORIES.APPETIZERS,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '11',
    name: 'Hummus with Naan',
    description: 'Creamy blended chickpeas with tahini, olive oil, and garlic, served with warm naan.',
    price: 9.95,
    category: CATEGORIES.APPETIZERS,
    image: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '12',
    name: 'Aushak',
    description: 'Leek-filled dumplings topped with meat sauce and yogurt.',
    price: 13.95,
    category: CATEGORIES.APPETIZERS,
    image: 'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '13',
    name: 'Qabeli Uzbaki',
    description: 'Uzbek-style pilaf with tender lamb, carrots, and raisins.',
    price: 25.95,
    category: CATEGORIES.ENTREES,
    image: 'https://images.unsplash.com/photo-1594977465942-5f68c78c253d?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '14',
    name: 'Chicken Kebab',
    description: 'Marinated chicken breast skewers grilled to perfection.',
    price: 19.95,
    category: CATEGORIES.ENTREES,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=2069&auto=format&fit=crop'
  },
  {
    id: '15',
    name: 'Chapli Kebab',
    description: 'Spicy minced beef patties fried and served with naan.',
    price: 18.95,
    category: CATEGORIES.ENTREES,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '16',
    name: 'Sabzi Chalow',
    description: 'Spinach stew served with white rice.',
    price: 17.95,
    category: CATEGORIES.VEGETARIAN,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1935&auto=format&fit=crop'
  },
  {
    id: '17',
    name: 'Bamia',
    description: 'Okra stew cooked with tomatoes and spices.',
    price: 16.95,
    category: CATEGORIES.VEGETARIAN,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '18',
    name: 'Daal Chalow',
    description: 'Lentil stew served with white rice and salad.',
    price: 15.95,
    category: CATEGORIES.VEGETARIAN,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '19',
    name: 'Baklava',
    description: 'Layers of filo pastry filled with chopped nuts and sweetened with honey.',
    price: 6.95,
    category: CATEGORIES.DESSERTS,
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: '20',
    name: 'Sheer Yakh',
    description: 'Afghan ice cream flavored with rosewater and cardamom.',
    price: 7.95,
    category: CATEGORIES.DESSERTS,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2788&auto=format&fit=crop'
  },
  {
    id: '21',
    name: 'Jalaibi',
    description: 'Deep-fried batter soaked in sugar syrup.',
    price: 5.95,
    category: CATEGORIES.DESSERTS,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop'
  },
  {
    id: '22',
    name: 'Mango Lassi',
    description: 'Creamy mango yogurt drink.',
    price: 5.50,
    category: CATEGORIES.BEVERAGES,
    image: 'https://images.unsplash.com/photo-1543362187-57351ad1d198?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: '23',
    name: 'Black Tea',
    description: 'Traditional brewed black tea.',
    price: 2.95,
    category: CATEGORIES.BEVERAGES,
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=1974&auto=format&fit=crop'
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



import { MenuItem, CATEGORIES } from './types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Mantu',
    description: 'Traditional steamed dumplings filled with spiced ground beef and onions, topped with split pea tomato sauce and garlic yogurt.',
    price: 12.95,
    category: CATEGORIES.APPETIZERS,
    image: '/images/mantu.jpg',
    isPopular: true
  },
  {
    id: '2',
    name: 'Bolani',
    description: 'Pan-fried flatbread stuffed with leeks and potatoes, served with yogurt dipping sauce.',
    price: 9.95,
    category: CATEGORIES.APPETIZERS,
    image: '/images/bolani.jpg'
  },
  {
    id: '3',
    name: 'Kabuli Palow',
    description: 'Our signature national dish. Tender lamb shank buried under seasoned rice topped with caramelized carrots and raisins.',
    price: 24.95,
    category: CATEGORIES.ENTREES,
    image: '/images/kabuli-palow.jpg',
    isPopular: true
  },
  {
    id: '4',
    name: 'Lamb Chops',
    description: 'Succulent lamb chops marinated in signature spices and charbroiled to perfection.',
    price: 28.95,
    category: CATEGORIES.ENTREES,
    image: '/images/lamb-chops.jpg',
    isPopular: true
  },
  {
    id: '5',
    name: 'Borani Banjan',
    description: 'Sauteed eggplant topped with a zesty tomato sauce and garlic yogurt.',
    price: 18.95,
    category: CATEGORIES.VEGETARIAN,
    image: '/images/borani-banjan.jpg'
  },
  {
    id: '6',
    name: 'Firnee',
    description: 'Traditional milk pudding flavored with rosewater, cardamom, and garnished with pistachios.',
    price: 7.95,
    category: CATEGORIES.DESSERTS,
    image: '/images/firnee.jpg'
  },
  {
    id: '7',
    name: 'Afghan Dogh',
    description: 'Refreshing homemade yogurt drink mixed with diced cucumbers and dried mint.',
    price: 4.50,
    category: CATEGORIES.BEVERAGES,
    image: '/images/dogh.jpg'
  },
  {
    id: '8',
    name: 'Green Tea with Cardamom',
    description: 'Traditional Afghan tea infused with aromatic cardamom pods.',
    price: 3.95,
    category: CATEGORIES.BEVERAGES,
    image: '/images/tea.jpg'
  },
  {
    id: '9',
    name: 'Sambosa',
    description: 'Crispy fried pastries filled with spiced potatoes and peas.',
    price: 7.95,
    category: CATEGORIES.APPETIZERS,
    image: '/images/sambosa.jpg'
  },
  {
    id: '10',
    name: 'Pakawra',
    description: 'Batter-fried potato slices served with chutney.',
    price: 8.95,
    category: CATEGORIES.APPETIZERS,
    image: '/images/pakawra.jpg'
  },
  {
    id: '11',
    name: 'Hummus with Naan',
    description: 'Creamy blended chickpeas with tahini, olive oil, and garlic, served with warm naan.',
    price: 9.95,
    category: CATEGORIES.APPETIZERS,
    image: '/images/hummus.jpg'
  },
  {
    id: '12',
    name: 'Aushak',
    description: 'Leek-filled dumplings topped with meat sauce and yogurt.',
    price: 14.95,
    category: CATEGORIES.APPETIZERS,
    image: '/images/aushak.jpg'
  },
  {
    id: '13',
    name: 'Qabeli Uzbaki',
    description: 'Uzbek-style pilaf with tender lamb, carrots, and raisins.',
    price: 25.95,
    category: CATEGORIES.ENTREES,
    image: '/images/qabeli-uzbaki.jpg'
  },
  {
    id: '14',
    name: 'Chicken Kebab',
    description: 'Marinated chicken breast skewers grilled to perfection.',
    price: 19.95,
    category: CATEGORIES.ENTREES,
    image: '/images/chicken-kebab.jpg'
  },
  {
    id: '15',
    name: 'Chapli Kebab',
    description: 'Spicy minced beef patties fried and served with naan.',
    price: 18.95,
    category: CATEGORIES.ENTREES,
    image: '/images/chapli-kebab.jpg'
  },
  {
    id: '16',
    name: 'Sabzi Chalow',
    description: 'Spinach stew served with white rice.',
    price: 17.95,
    category: CATEGORIES.VEGETARIAN,
    image: '/images/sabzi-chalow.jpg'
  },
  {
    id: '17',
    name: 'Bamia',
    description: 'Okra stew cooked with tomatoes and spices.',
    price: 16.95,
    category: CATEGORIES.VEGETARIAN,
    image: '/images/bamia.jpg'
  },
  {
    id: '18',
    name: 'Daal Chalow',
    description: 'Lentil stew served with white rice and salad.',
    price: 15.95,
    category: CATEGORIES.VEGETARIAN,
    image: '/images/daal-chalow.jpg'
  },
  {
    id: '19',
    name: 'Baklava',
    description: 'Layers of filo pastry filled with chopped nuts and sweetened with honey.',
    price: 6.95,
    category: CATEGORIES.DESSERTS,
    image: '/images/baklava.jpg'
  },
  {
    id: '20',
    name: 'Sheer Yakh',
    description: 'Afghan ice cream flavored with rosewater and cardamom.',
    price: 7.95,
    category: CATEGORIES.DESSERTS,
    image: '/images/sheer-yakh.jpg'
  },
  {
    id: '21',
    name: 'Jalaibi',
    description: 'Deep-fried batter soaked in sugar syrup.',
    price: 5.95,
    category: CATEGORIES.DESSERTS,
    image: '/images/jalaibi.jpg'
  },
  {
    id: '22',
    name: 'Mango Lassi',
    description: 'Creamy mango yogurt drink.',
    price: 5.50,
    category: CATEGORIES.BEVERAGES,
    image: '/images/mango-lassi.jpg'
  },
  {
    id: '23',
    name: 'Black Tea',
    description: 'Traditional brewed black tea.',
    price: 2.95,
    category: CATEGORIES.BEVERAGES,
    image: '/images/black-tea.jpg'
  }
];

export const SITE_INFO = {
  name: 'GENSAVOR',
  subName: 'Food And More',
  address: '3200 W Victory Blvd, Burbank, CA 91505',
  phone: '(818) 555-0123',
  hours: {
    weekdays: '11:00 AM - 9:30 PM',
    weekends: '12:00 PM - 10:30 PM'
  }
};

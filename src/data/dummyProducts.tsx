// src/data/dummyProducts.ts
import { Product } from '../types';
export const dummyProducts: Product[] = [
  {
    id: 1,
    name: 'Aloe Vera Gel',
    price: 19.99,
    image: '../src/assets/images/img1.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Gel',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Aloe Moisturizer',
    price: 24.99,
    image: '../src/assets/images/img2.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Moisturizer',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Aloe Face Mask',
    price: 14.99,
    image: '../src/assets/images/img3.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Mask',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Aloe Body Lotion',
    price: 29.99,
    image: '../src/assets/images/img4.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Lotion',
    rating: 4.3,
  },
  {
    id: 5,
    name: 'Aloe Cleanser',
    price: 15.99,
    image: '../src/assets/images/img4.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Cleanser',
    rating: 4.0,
  },
  {
    id: 6,
    name: 'Aloe Sunscreen',
    price: 22.99,
    image: '../src/assets/images/img4.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Sunscreen',
    rating: 4.6,
  },
];
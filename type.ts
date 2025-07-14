export interface Product {
     id: number;
     name: string;
     price: number;
     image: string;
     category: string;
     rating?: number; // Ensure rating is optional
   }